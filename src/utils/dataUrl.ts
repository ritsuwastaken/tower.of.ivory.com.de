export function getDataUrl(path: string): string {
  const base = typeof process.env.NEXT_PUBLIC_BASE_PATH === 'string'
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
