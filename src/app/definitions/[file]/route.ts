import { definitionFiles, readDefinition } from '@/utils/definitions'

export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () =>
  definitionFiles().map((file) => ({ file }))

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  return new Response(readDefinition(file), {
    headers: { 'Content-Type': 'application/json' },
  })
}
