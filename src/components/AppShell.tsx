'use client'

import { Footer } from '@/components/Footer'
import { GlobalStyles } from '@/components/GlobalStyles'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import type { ReactNode } from 'react'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
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
  padding: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`
