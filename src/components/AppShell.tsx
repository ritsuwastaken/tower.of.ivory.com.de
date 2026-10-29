'use client'

import { Footer } from '@/components/Footer'
import { GlobalStyles } from '@/components/GlobalStyles'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import type { ReactNode } from 'react'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import i18n, { defaultLanguage, supportedLanguages } from '@/i18n'
import { AssetBasePathContext } from '@/components/CatalogImage'

export default function AppShell({
  children,
  basePath = '',
}: {
  children: ReactNode
  basePath?: string
}) {
  const { language } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = language.split('-')[0] || defaultLanguage
  }, [language])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('i18nextLng')
      if (
        stored &&
        supportedLanguages.includes(stored) &&
        i18n.language.split('-')[0] !== stored
      ) {
        void i18n.changeLanguage(stored)
      }
    } catch {}
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
