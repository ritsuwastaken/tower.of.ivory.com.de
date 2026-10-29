import { useDataUrl } from '@/hooks/useDataUrl'
import NextHead from 'next/head'

export const Head = ({ description }: { description?: string }) => {
  const title = description
    ? `${description} | Tower of Ivory`
    : 'Tower of Ivory - Unofficial database for Harbor C1 X1 server'
  const getDataUrl = useDataUrl()
  return (
    <NextHead>
      <title>{title}</title>
      <link rel="icon" href={getDataUrl('/favicon.ico')} />
    </NextHead>
  )
}
