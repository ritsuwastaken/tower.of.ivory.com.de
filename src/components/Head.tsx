import NextHead from 'next/head'

export const Head = ({ description }: { description?: string }) => {
  const title = description
    ? `${description} | Tower of Ivory`
    : 'Tower of Ivory - Unofficial database for Harbor C1 X1 server'
  return (
    <NextHead>
      <title>{title}</title>
    </NextHead>
  )
}
