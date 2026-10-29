'use client'

import { createContext, useContext } from 'react'

export const AssetBasePathContext = createContext('')

export function useDataUrl() {
  const basePath = useContext(AssetBasePathContext)
  return (path: string) =>
    `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}
