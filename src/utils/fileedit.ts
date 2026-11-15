import { decode, encode, initParams, type Options } from 'l2encdec'
import { parseSchemas } from 'l2asmdisasm'
import type { DatRequest, DatResponse, SaveProblem } from '@/utils/dat.worker'

export const fileTypes = ['.dat', '.ini', '.txt']

export type Language = 'json' | 'ini' | 'l2txt'

export interface Container {
  protocol: number
  legacyRsa: boolean
}

export interface TextFormat {
  bom: Uint8Array
  utf16: boolean
  latin1: boolean
  crlf: boolean
}

export interface Definition {
  name: string
  text: string
  clients: string[]
}

interface BaseDocument {
  name: string
  container: Container
  text: string
}

export interface TextDocument extends BaseDocument {
  kind: 'text'
  format: TextFormat
}

export interface DatDocument extends BaseDocument {
  kind: 'dat'
  plain: Uint8Array
  definition: Definition
  client: string
}

export type FileDocument = TextDocument | DatDocument

const HEADER_PREFIX = 'Lineage2Ver'
const HEADER_SIZE = 28
const UTF16_BOM = new Uint8Array([0xff, 0xfe])
const UTF8_BOM = new Uint8Array([0xef, 0xbb, 0xbf])

export const extension = (name: string) =>
  name.slice(name.lastIndexOf('.')).toLowerCase()

export const baseName = (name: string) =>
  name.slice(0, name.lastIndexOf('.')).toLowerCase()

export const languageOf = (name: string): Language =>
  extension(name) === '.dat'
    ? 'json'
    : extension(name) === '.ini'
      ? 'ini'
      : 'l2txt'

export function detectProtocol(file: Uint8Array): number {
  if (file.length < HEADER_SIZE) return 0
  let text = ''
  for (let i = 0; i < HEADER_SIZE; i += 2) {
    if (file[i + 1] !== 0) return 0
    text += String.fromCharCode(file[i])
  }
  const digits = text.slice(HEADER_PREFIX.length)
  return text.startsWith(HEADER_PREFIX) && /^\d+$/.test(digits)
    ? Number(digits)
    : 0
}

export async function unwrap(
  file: Uint8Array,
  name: string,
): Promise<{ container: Container; plain: Uint8Array }> {
  const protocol = detectProtocol(file)
  if (!protocol)
    return { container: { protocol, legacyRsa: false }, plain: file }
  const rsa = protocol >= 411 && protocol <= 414
  let failure: unknown
  for (const legacyRsa of rsa ? [true, false] : [false]) {
    try {
      const plain = await decode(
        file,
        initParams(protocol, { filename: name, legacyRsa }),
      )
      return { container: { protocol, legacyRsa }, plain }
    } catch (error) {
      failure = error
    }
  }
  throw failure
}

export const wrap = (
  plain: Uint8Array,
  container: Container,
  name: string,
  options?: Options,
) =>
  container.protocol
    ? encode(plain, initParams(container.protocol, { filename: name }), options)
    : Promise.resolve(plain)

const startsWith = (data: Uint8Array, mark: Uint8Array) =>
  mark.every((byte, i) => data[i] === byte)

export function decodeText(plain: Uint8Array): {
  text: string
  format: TextFormat
} {
  const bom = [UTF16_BOM, UTF8_BOM].find((mark) => startsWith(plain, mark))
  const data = plain.subarray(bom?.length ?? 0)
  const utf16 = bom === UTF16_BOM
  let text: string
  let latin1 = false
  try {
    text = new TextDecoder(utf16 ? 'utf-16le' : 'utf-8', {
      fatal: true,
      ignoreBOM: true,
    }).decode(data)
  } catch {
    latin1 = true
    text = Array.from(data, (byte) => String.fromCharCode(byte)).join('')
  }
  const crlf = text.includes('\r\n')
  return {
    text: crlf ? text.replaceAll('\r\n', '\n') : text,
    format: { bom: bom ?? new Uint8Array(), utf16, latin1, crlf },
  }
}

export function encodeText(text: string, format: TextFormat): Uint8Array {
  if (format.crlf) text = text.replace(/\r?\n/g, '\r\n')
  let body: Uint8Array
  if (format.utf16) {
    body = new Uint8Array(text.length * 2)
    for (let i = 0; i < text.length; i++) {
      const unit = text.charCodeAt(i)
      body[i * 2] = unit & 0xff
      body[i * 2 + 1] = unit >> 8
    }
  } else if (format.latin1) {
    body = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      const unit = text.charCodeAt(i)
      if (unit > 0xff)
        throw new Error(`Character cannot be saved as Latin-1: ${text[i]}`)
      body[i] = unit
    }
  } else body = new TextEncoder().encode(text)
  const result = new Uint8Array(format.bom.length + body.length)
  result.set(format.bom)
  result.set(body, format.bom.length)
  return result
}

export function textEncoding(format: TextFormat): string {
  if (format.utf16) return 'UTF-16LE'
  if (format.latin1) return 'Latin-1'
  return format.bom.length ? 'UTF-8 BOM' : 'UTF-8'
}

export async function fetchDefinition(
  basePath: string,
  name: string,
): Promise<Definition | null> {
  const response = await fetch(`${basePath}/definitions/${name}.json`)
  if (!response.ok) return null
  const text = await response.text()
  const clients = [
    ...new Set(parseSchemas(text).flatMap((schema) => schema.clients)),
  ].sort((a, b) => a.localeCompare(b))
  return { name, text, clients }
}

function callDatWorker(request: DatRequest): Promise<DatResponse> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./dat.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = ({ data }: MessageEvent<DatResponse>) => {
      worker.terminate()
      resolve(data)
    }
    worker.onerror = (event) => {
      worker.terminate()
      reject(new Error(event.message))
    }
    worker.postMessage(request)
  })
}

export async function openDatInWorker(
  plain: Uint8Array,
  definition: Definition,
  client: string,
  detect: boolean,
) {
  const response = await callDatWorker({
    kind: 'open',
    plain,
    definition: definition.text,
    client,
    detect,
  })
  if (response.kind !== 'open') throw new Error('Unexpected worker response')
  return response
}

export class SaveError extends Error {
  readonly problem: SaveProblem | null

  constructor(message: string, problem: SaveProblem | null) {
    super(message)
    this.problem = problem
  }
}

async function assembleInWorker(
  text: string,
  document: DatDocument,
): Promise<Uint8Array> {
  const response = await callDatWorker({
    kind: 'save',
    text,
    definition: document.definition.text,
    client: document.client,
  })
  if (response.kind !== 'save') throw new Error('Unexpected worker response')
  if (!response.plain) throw new SaveError(response.error, response.problem)
  return response.plain
}

export const serialize = (
  document: FileDocument,
  text: string,
): Promise<Uint8Array> =>
  document.kind === 'dat'
    ? assembleInWorker(text, document)
    : Promise.resolve(encodeText(text, document.format))
