import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../public/locales/en/common.json'
import es from '../public/locales/es/common.json'
import pt from '../public/locales/pt/common.json'
import ru from '../public/locales/ru/common.json'
import de from '../public/locales/de/common.json'

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  pt: {
    translation: pt,
  },
  ru: {
    translation: ru,
  },
  de: {
    translation: de,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng:
    typeof window !== 'undefined'
      ? localStorage.getItem('i18nextLng') || 'en'
      : 'en',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
})

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng)
  }
})

export default i18n
