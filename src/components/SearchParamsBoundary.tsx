'use client'

import { createContext, Suspense, useContext, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

const SearchParamsContext = createContext(new URLSearchParams())

function SearchParamsProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  return (
    <SearchParamsContext.Provider value={searchParams}>
      {children}
    </SearchParamsContext.Provider>
  )
}

export function SearchParamsBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <SearchParamsProvider>{children}</SearchParamsProvider>
    </Suspense>
  )
}

export function useCatalogSearchParams() {
  return useContext(SearchParamsContext)
}
