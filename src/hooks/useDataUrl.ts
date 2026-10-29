import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function useDataUrl() {
  const { basePath } = useRouter()

  return useCallback(
    (path: string) => `${basePath}${path.startsWith('/') ? path : `/${path}`}`,
    [basePath],
  )
}
