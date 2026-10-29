'use client'

import { Footer } from '@/components/Footer'
import { GlobalStyles } from '@/components/GlobalStyles'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import type { ReactNode } from 'react'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { useEffect } from 'react'
import styled from 'styled-components'
import i18n from '../i18n'
import { AssetBasePathContext } from '@/hooks/useDataUrl'

const SUPPORTED_LANGUAGES = ['en', 'es', 'pt', 'ru', 'de'] as const

export default function AppShell({
  children,
  basePath = '',
}: {
  children: ReactNode
  basePath?: string
}) {
  useEffect(() => {
    const baseLng = (lng: string) => lng.split('-')[0] || 'en'
    const applyHtmlLang = (lng: string) => {
      document.documentElement.lang = baseLng(lng)
    }

    const handleLanguageChanged = (lng: string) => applyHtmlLang(lng)

    i18n.on('languageChanged', handleLanguageChanged)

    let stored: string | null = null
    try {
      stored = localStorage.getItem('i18nextLng')
    } catch {}
    if (
      stored &&
      (SUPPORTED_LANGUAGES as readonly string[]).includes(stored) &&
      baseLng(i18n.language) !== stored
    ) {
      void i18n.changeLanguage(stored)
    } else {
      applyHtmlLang(i18n.language)
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  return (
    <AssetBasePathContext.Provider value={basePath}>
      <GlobalStyles />
      <Layout>
        <Header />
        <SearchParamsBoundary>
          <Navigation />
        </SearchParamsBoundary>
        <Main>{children}</Main>
        <Footer />
      </Layout>
    </AssetBasePathContext.Provider>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Layout = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
