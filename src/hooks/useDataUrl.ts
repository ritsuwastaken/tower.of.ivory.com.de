import { useRouter } from 'next/router'

export function useDataUrl() {
  const { basePath } = useRouter()

  return (path: string) =>
    `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}
