import NextHead from 'next/head'

export const Head = ({ description }: { description?: string }) => {
  const title = description
    ? `${description} | Tower of Ivory`
    : 'Tower of Ivory - Unofficial database for Harbor C1 X1 server'
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return (
    <NextHead>
      <title>{title}</title>
      <link rel="icon" href={`${basePath}/favicon.ico`} />
    </NextHead>
  )
}
