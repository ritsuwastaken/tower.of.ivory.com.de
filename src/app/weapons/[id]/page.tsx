import { notFound } from 'next/navigation'
import { ItemDetails } from '@/components/ItemDetails'
import { getItem, getStaticParams } from '@/utils/catalog'

type Props = { params: Promise<{ id: string }> }
export const dynamicParams = false
export const generateStaticParams = () => getStaticParams('weapon')

export async function generateMetadata({ params }: Props) {
  const item = await getItem('weapon', (await params).id)
  return { title: item?.name || item?.object_name || 'Item Not Found' }
}

export default async function Page({ params }: Props) {
  const item = await getItem('weapon', (await params).id)
  if (!item) notFound()
  return <ItemDetails key={item.object_id} item={item} />
}
