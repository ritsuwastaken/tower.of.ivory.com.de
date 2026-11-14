'use client'

import type * as Monaco from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import i18n from '@/i18n'

export type MonacoApi = typeof Monaco
export type Editor = Monaco.editor.IStandaloneCodeEditor
export type EditorOptions = Monaco.editor.IStandaloneEditorConstructionOptions

const messages: Record<string, () => Promise<unknown>> = {
  de: () => import('monaco-editor/nls/lang/de.js'),
  es: () => import('monaco-editor/nls/lang/es.js'),
  ru: () => import('monaco-editor/nls/lang/ru.js'),
}

let loading: Promise<MonacoApi> | null = null

const loadMonaco = () =>
  (loading ??= (async () => {
    try {
      await messages[new Intl.Locale(i18n.language).language]?.()
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
    return import('monaco-editor')
  })())

export default function MonacoEditor({
  value,
  language,
  options,
  loadingText,
  beforeMount,
  onMount,
  onChange,
}: {
  value: string
  language: string
  options?: EditorOptions
  loadingText?: string
  beforeMount?: (monaco: MonacoApi) => void
  onMount?: (editor: Editor, monaco: MonacoApi) => void
  onChange?: () => void
}) {
  const container = useRef<HTMLDivElement | null>(null)
  const callbacks = useRef({ beforeMount, onMount, onChange })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    callbacks.current = { beforeMount, onMount, onChange }
  })

  useEffect(() => {
    let editor: Editor | null = null
    let disposed = false
    void loadMonaco().then((monaco) => {
      if (disposed || !container.current) return
      callbacks.current.beforeMount?.(monaco)
      editor = monaco.editor.create(container.current, {
        ...options,
        value,
        language,
      })
      editor.onDidChangeModelContent(() => callbacks.current.onChange?.())
      callbacks.current.onMount?.(editor, monaco)
      setReady(true)
    })
    return () => {
      disposed = true
      editor?.getModel()?.dispose()
      editor?.dispose()
    }
  }, [value, language, options])

  return (
    <>
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loadingText}
        </div>
      )}
      <div ref={container} style={{ position: 'absolute', inset: 0 }} />
    </>
  )
}
