'use client'

import type * as Monaco from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
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
  version,
  options,
  loadingText,
  busyText,
  beforeMount,
  onMount,
  onChange,
}: {
  value: string
  language: string
  version?: number
  options?: EditorOptions
  loadingText?: string
  busyText?: string
  beforeMount?: (monaco: MonacoApi) => void
  onMount?: (editor: Editor, monaco: MonacoApi) => void
  onChange?: () => void
}) {
  const container = useRef<HTMLDivElement | null>(null)
  const instance = useRef<{ editor: Editor; monaco: MonacoApi } | null>(null)
  const latest = useRef({ value, language, options })
  const callbacks = useRef({ beforeMount, onMount, onChange })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    latest.current = { value, language, options }
    callbacks.current = { beforeMount, onMount, onChange }
  })

  useEffect(() => {
    let disposed = false
    void loadMonaco().then((monaco) => {
      if (disposed || !container.current) return
      callbacks.current.beforeMount?.(monaco)
      const { value, language, options } = latest.current
      const editor = monaco.editor.create(container.current, {
        ...options,
        value,
        language,
      })
      editor.onDidChangeModelContent(() => callbacks.current.onChange?.())
      instance.current = { editor, monaco }
      callbacks.current.onMount?.(editor, monaco)
      setReady(true)
    })
    return () => {
      disposed = true
      instance.current?.editor.getModel()?.dispose()
      instance.current?.editor.dispose()
      instance.current = null
    }
  }, [])

  useEffect(() => {
    if (!instance.current) return
    const { editor, monaco } = instance.current
    const previous = editor.getModel()
    editor.setModel(monaco.editor.createModel(value, language))
    previous?.dispose()
  }, [value, language, version])

  useEffect(() => {
    instance.current?.editor.updateOptions({
      readOnly: !!busyText,
      readOnlyMessage: { value: busyText ?? '' },
    })
  }, [busyText, ready])

  const overlay = ready ? busyText : loadingText

  return (
    <>
      <div ref={container} style={{ position: 'absolute', inset: 0 }} />
      {overlay && <Overlay $dim={ready}>{overlay}</Overlay>}
    </>
  )
}

const appear = keyframes`
  from {
    opacity: 0;
  }
`

const Overlay = styled.div<{ $dim: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${appear} 0.2s 0.3s both;

  ${({ $dim }) =>
    $dim &&
    css`
      background-color: rgb(0 0 0 / 0.4);
    `}
`
