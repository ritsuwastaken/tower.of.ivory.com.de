import { Footer } from '@/components/Footer'
import { GlobalStyles } from '@/components/GlobalStyles'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import {
  HydrationBoundary,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { Roboto_Mono } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import i18n from '../i18n'

const SUPPORTED_LANGUAGES = ['en', 'es', 'pt', 'ru', 'de'] as const

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  },
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

  useEffect(() => {
    const baseLng = (lng: string) => lng.split('-')[0] || 'en'
    const applyHtmlLang = (lng: string) => {
      document.documentElement.lang = baseLng(lng)
    }

    const handleLanguageChanged = (lng: string) => applyHtmlLang(lng)

    i18n.on('languageChanged', handleLanguageChanged)

    const stored = localStorage.getItem('i18nextLng')
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
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <GlobalStyles />
        <Layout>
          <Header />
          <Navigation />
          <Main>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1 "
              />
              <meta
                name="description"
                content="A database of items, skills, and other information from the Harbor client. Not affiliated with the Harbor project."
              />
              <meta
                name="keywords"
                content="Harbor, Tower of Ivory, C1 X1, database, items, skills, information, ElmoreLab, Harbingers of War, Lineage 2, Lineage II"
              />
            </Head>
            <Component {...pageProps} />
          </Main>
          <Footer />
        </Layout>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
})

const Layout = styled.div.attrs({
  className: robotoMono.className,
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
