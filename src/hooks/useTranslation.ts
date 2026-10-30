'use client'

import { useSyncExternalStore } from 'react'
import { useTranslation as useI18nextTranslation } from 'react-i18next'
import i18n, { defaultLanguage } from '@/i18n'

function subscribe(onChange: () => void) {
  i18n.on('languageChanged', onChange)
  return () => {
    i18n.off('languageChanged', onChange)
  }
}

const getLanguage = () => i18n.language
const getServerLanguage = () => defaultLanguage

export function useTranslation() {
  const language = useSyncExternalStore(
    subscribe,
    getLanguage,
    getServerLanguage,
  )
  const {
    t,
    i18n: translationI18n,
    ready,
  } = useI18nextTranslation(undefined, {
    lng: language,
  })
  return { t, i18n: translationI18n, ready, language }
}
