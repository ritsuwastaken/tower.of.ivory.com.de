'use client'

import type { BeforeMount, OnMount } from '@monaco-editor/react'
import type { languages } from 'monaco-editor'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { AssetBasePathContext } from '@/components/CatalogImage'
import { controlStyles } from '@/components/Control.styles'
import { selectStyles } from '@/components/Select.styles'
import { useTranslation } from '@/hooks/useTranslation'
import i18n from '@/i18n'
import {
  baseName,
  decodeText,
  extension,
  fetchDefinition,
  fileTypes,
  languageOf,
  openDatInWorker,
  errorLocation,
  serialize,
  textEncoding,
  unwrap,
  wrap,
  type Container,
  type Definition,
  type FileDocument,
} from '@/utils/fileedit'

type Editor = Parameters<OnMount>[0]

const monacoMessages: Record<string, () => Promise<unknown>> = {
  de: () => import('monaco-editor/nls/lang/de.js'),
  es: () => import('monaco-editor/nls/lang/es.js'),
  ru: () => import('monaco-editor/nls/lang/ru.js'),
}

const Editor = dynamic(
  async () => {
    try {
      await monacoMessages[new Intl.Locale(i18n.language).language]?.()
    } catch {
      // ignore
    }
    globalThis.MonacoEnvironment = {
      getWorker(_workerId, label) {
        if (label === 'json')
          return new Worker(
            new URL(
              'monaco-editor/languages/features/json/json.worker.js',
              import.meta.url,
            ),
            { type: 'module' },
          )
        return new Worker(
          new URL(
            'monaco-editor/editor/common/services/editorWebWorkerMain.js',
            import.meta.url,
          ),
          { type: 'module' },
        )
      },
    }
    const [monaco, { default: Editor, loader }] = await Promise.all([
      import('monaco-editor'),
      import('@monaco-editor/react'),
    ])
    loader.config({ monaco })
    return Editor
  },
  { ssr: false },
)

interface OpenedFile {
  name: string
  container: Container
  plain: Uint8Array
}

const CLIENT_KEY = 'fileedit.client'
const LARGE_TEXT = 20_000_000

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

const preferredClient = (definition: Definition) => {
  let stored = ''
  try {
    stored = localStorage.getItem(CLIENT_KEY) ?? ''
  } catch {}
  return definition.clients.includes(stored)
    ? stored
    : (definition.clients[0] ?? '')
}

const registerLanguages: BeforeMount = (monaco) => {
  if (
    monaco.languages
      .getLanguages()
      .some(({ id }: languages.ILanguageExtensionPoint) => id === 'l2txt')
  )
    return
  monaco.languages.register({ id: 'l2txt' })
  monaco.languages.setMonarchTokensProvider('l2txt', {
    tokenizer: {
      root: [
        [/\b\w+_(begin|end)\b/, 'keyword'],
        [/([\w.]+)(=)/, ['attribute.name', 'delimiter']],
        [/\[[^\]\t\n]*\]/, 'string'],
        [/[{};]/, 'delimiter'],
        [/-?\d+(\.\d+)?\b/, 'number'],
        [/@\w+/, 'variable'],
      ],
    },
  })
}

function download(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart]))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export default function FileEditPage({
  definitionNames,
}: {
  definitionNames: string[]
}) {
  const { t } = useTranslation()
  const basePath = useContext(AssetBasePathContext)
  const editorRef = useRef<Editor | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const saveRef = useRef<() => void>(() => {})
  const [file, setFile] = useState<OpenedFile | null>(null)
  const [fileDocument, setFileDocument] = useState<FileDocument | null>(null)
  const [revision, setRevision] = useState(0)
  const [definition, setDefinition] = useState<Definition | null>(null)
  const [client, setClient] = useState('')
  const [matching, setMatching] = useState<string[] | null>(null)
  const detection = useRef(0)
  const [modified, setModified] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!modified) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [modified])

  const show = (next: FileDocument | null) => {
    setFileDocument(next)
    setModified(false)
    setRevision((value) => value + 1)
  }

  const openDefinition = async (
    opened: OpenedFile,
    chosen: Definition,
    version?: string,
  ) => {
    const id = ++detection.current
    const detect = version === undefined && chosen.clients.length > 0
    const requested = version ?? preferredClient(chosen)
    setDefinition(chosen)
    setClient(requested)
    if (version === undefined) setMatching(null)
    show(null)
    setError('')
    setStatus(t(detect ? 'fileEdit.detecting' : 'fileEdit.opening'))
    try {
      const result = await openDatInWorker(
        opened.plain,
        chosen,
        requested,
        detect,
      )
      if (id !== detection.current) return
      if (result.matching) setMatching(result.matching)
      setClient(result.client)
      if (result.text === null) {
        setError(
          result.matching?.length === 0
            ? `${t('fileEdit.noMatchingClient')}\n${result.error}`
            : result.error,
        )
        return
      }
      show({
        kind: 'dat',
        ...opened,
        definition: chosen,
        client: result.client,
        text: result.text,
      })
    } catch (failure) {
      if (id === detection.current) setError(messageOf(failure))
    } finally {
      if (id === detection.current) setStatus('')
    }
  }

  const open = async (selected: File) => {
    if (modified && !window.confirm(t('fileEdit.discardChanges'))) return
    if (!fileTypes.includes(extension(selected.name))) {
      setError(t('fileEdit.unsupported', { name: selected.name }))
      return
    }
    setError('')
    setStatus(t('fileEdit.opening'))
    try {
      const { container, plain } = await unwrap(
        new Uint8Array(await selected.arrayBuffer()),
        selected.name,
      )
      const opened = { name: selected.name, container, plain }
      setFile(opened)
      setDefinition(null)
      setMatching(null)
      detection.current++
      if (extension(selected.name) !== '.dat') {
        show({ kind: 'text', ...opened, ...decodeText(plain) })
        return
      }
      const found = definitionNames.includes(baseName(selected.name))
        ? await fetchDefinition(basePath, baseName(selected.name))
        : null
      if (!found) {
        show(null)
        setError(t('fileEdit.noDefinition', { name: selected.name }))
        return
      }
      await openDefinition(opened, found)
    } catch (failure) {
      setFile(null)
      show(null)
      setError(messageOf(failure))
    } finally {
      setStatus('')
    }
  }

  const changeDefinition = async (name: string) => {
    if (!file || (modified && !window.confirm(t('fileEdit.discardChanges'))))
      return
    try {
      const found = await fetchDefinition(basePath, name)
      if (found) await openDefinition(file, found)
    } catch (failure) {
      setError(messageOf(failure))
    }
  }

  const changeClient = (version: string) => {
    if (!file || !definition) return
    if (modified && !window.confirm(t('fileEdit.discardChanges'))) return
    try {
      localStorage.setItem(CLIENT_KEY, version)
    } catch {}
    void openDefinition(file, definition, version)
  }

  const save = async () => {
    const editor = editorRef.current
    if (!fileDocument || !editor || status) return
    if (
      fileDocument.container.legacyRsa &&
      !window.confirm(t('fileEdit.legacyWarning'))
    )
      return
    setError('')
    setStatus(t('fileEdit.saving'))
    try {
      const bytes = await wrap(
        await serialize(fileDocument, editor.getValue()),
        fileDocument.container,
        fileDocument.name,
        {
          onProgress: (done, total) =>
            setStatus(
              t('fileEdit.encrypting', {
                percent: total ? Math.floor((done / total) * 100) : 100,
              }),
            ),
        },
      )
      download(bytes, fileDocument.name)
      setModified(false)
    } catch (failure) {
      const message = messageOf(failure)
      setError(message)
      if (document.fullscreenElement) void document.exitFullscreen()
      const location = errorLocation(message)
      if (location) {
        const position = { lineNumber: location.line, column: location.column }
        editor.setPosition(position)
        editor.revealPositionInCenter(position)
        editor.focus()
      }
    } finally {
      setStatus('')
    }
  }

  useEffect(() => {
    saveRef.current = () => void save()
  })

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
      saveRef.current(),
    )
    editor.addAction({
      id: 'fileedit.fullScreen',
      label: t('fileEdit.fullScreen'),
      contextMenuGroupId: 'navigation',
      run: () =>
        void (document.fullscreenElement
          ? document.exitFullscreen()
          : frameRef.current?.requestFullscreen()),
    })
  }

  const showDatControls = extension(file?.name ?? '') === '.dat'
  const large = (fileDocument?.text.length ?? 0) > LARGE_TEXT
  const summary = fileDocument && [
    fileDocument.container.protocol
      ? `Lineage2Ver${fileDocument.container.protocol}`
      : t('fileEdit.notEncrypted'),
    fileDocument.kind === 'text'
      ? textEncoding(fileDocument.format)
      : `${fileDocument.definition.name}.json`,
    ...(large ? [t('fileEdit.largeFile')] : []),
  ]

  return (
    <Page
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const dropped = event.dataTransfer.files[0]
        if (dropped) void open(dropped)
      }}
    >
      <Toolbar>
        <FileButton>
          {t('fileEdit.open')}
          <input
            type="file"
            accept={fileTypes.join(',')}
            onChange={(event) => {
              const selected = event.target.files?.[0]
              event.target.value = ''
              if (selected) void open(selected)
            }}
          />
        </FileButton>
        <Button
          type="button"
          disabled={!fileDocument || !!status}
          onClick={() => void save()}
        >
          {t('fileEdit.save')}
        </Button>
        {showDatControls && definitionNames.length > 0 && (
          <Select
            aria-label={t('fileEdit.definition')}
            value={definition?.name ?? ''}
            onChange={(event) => void changeDefinition(event.target.value)}
          >
            {!definition && (
              <option value="">{t('fileEdit.definition')}</option>
            )}
            {definitionNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        )}
        {showDatControls && definition && definition.clients.length > 0 && (
          <Select
            aria-label={t('fileEdit.client')}
            value={client}
            onChange={(event) => changeClient(event.target.value)}
          >
            {matching === null ? (
              definition.clients.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))
            ) : (
              <>
                {matching.length > 0 && (
                  <optgroup label={t('fileEdit.matchingClients')}>
                    {matching.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label={t('fileEdit.otherClients')}>
                  {definition.clients
                    .filter((version) => !matching.includes(version))
                    .map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                </optgroup>
              </>
            )}
          </Select>
        )}
        <Status>
          {status ||
            (fileDocument &&
              `${fileDocument.name}${modified ? '*' : ''} · ${summary?.join(' · ')}`)}
        </Status>
      </Toolbar>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      {fileDocument ? (
        <EditorFrame ref={frameRef}>
          <Editor
            key={revision}
            theme="vs-dark"
            height="100%"
            language={large ? 'plaintext' : languageOf(fileDocument.name)}
            defaultValue={fileDocument.text}
            beforeMount={registerLanguages}
            onMount={onMount}
            onChange={() => setModified(true)}
            loading={t('meta.loading')}
            wrapperProps={{
              style: {
                display: 'flex',
                position: 'absolute',
                inset: 0,
              },
            }}
            options={{
              automaticLayout: true,
              fontSize: 13,
              renderWhitespace: 'boundary',
              scrollBeyondLastLine: false,
              wordWrap: 'off',
            }}
          />
        </EditorFrame>
      ) : (
        <DropZone>{t('fileEdit.hint')}</DropZone>
      )}
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Button = styled.button`
  ${controlStyles}
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:disabled {
    cursor: default;
    color: ${({ theme }) => theme.colors.muted};
  }
`

const FileButton = styled.label`
  ${controlStyles}
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:hover,
  &:focus-within {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`

const Select = styled.select`
  ${selectStyles}
  width: auto;
  max-width: 18rem;
`

const Status = styled.output`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.small};
`

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small};
  white-space: pre-wrap;
`

const EditorFrame = styled.div`
  position: relative;
  flex: 1;
  min-height: 70vh;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.panel};
  overflow: hidden;

  &:fullscreen {
    border: none;
    border-radius: 0;
  }
`

const DropZone = styled.div`
  display: flex;
  flex: 1;
  min-height: 50vh;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.panel};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`
