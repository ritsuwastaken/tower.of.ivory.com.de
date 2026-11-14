import { assemble, disassemble, parseSchema, parseSchemas } from 'l2asmdisasm'

export type DatRequest =
  | {
      kind: 'open'
      plain: Uint8Array
      definition: string
      client: string
      detect: boolean
    }
  | { kind: 'save'; text: string; definition: string; client: string }

export type DatResponse =
  | {
      kind: 'open'
      client: string
      text: string | null
      error: string
      matching: string[] | null
    }
  | { kind: 'save'; plain: Uint8Array | null; error: string }

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<DatRequest>) => void) | null
  postMessage: (response: DatResponse, transfer?: Transferable[]) => void
}

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

function attempt(run: () => string): { text: string } | { error: string } {
  try {
    return { text: run() }
  } catch (error) {
    return { error: messageOf(error) }
  }
}

function open(
  request: Extract<DatRequest, { kind: 'open' }>,
): Extract<DatResponse, { kind: 'open' }> {
  const { plain, definition, client, detect } = request
  if (!detect) {
    const result = attempt(() =>
      disassemble(plain, parseSchema(definition, client)),
    )
    return 'text' in result
      ? { kind: 'open', client, text: result.text, error: '', matching: null }
      : {
          kind: 'open',
          client,
          text: null,
          error: result.error,
          matching: null,
        }
  }
  const matching: string[] = []
  let chosen: { client: string; text: string } | null = null
  let error = ''
  for (const schema of parseSchemas(definition)) {
    const preferred = schema.clients.includes(client)
    const result = attempt(() => disassemble(plain, schema))
    if ('error' in result) {
      if (preferred || !error) error = result.error
      continue
    }
    matching.push(...schema.clients)
    if (preferred) chosen = { client, text: result.text }
    else chosen ??= { client: schema.clients[0], text: result.text }
  }
  return chosen
    ? { kind: 'open', ...chosen, error: '', matching }
    : { kind: 'open', client, text: null, error, matching }
}

scope.onmessage = ({ data }) => {
  if (data.kind === 'open') {
    try {
      scope.postMessage(open(data))
    } catch (error) {
      scope.postMessage({
        kind: 'open',
        client: data.client,
        text: null,
        error: messageOf(error),
        matching: null,
      })
    }
    return
  }
  try {
    const plain = assemble(data.text, parseSchema(data.definition, data.client))
    scope.postMessage({ kind: 'save', plain, error: '' }, [plain.buffer])
  } catch (error) {
    scope.postMessage({ kind: 'save', plain: null, error: messageOf(error) })
  }
}
