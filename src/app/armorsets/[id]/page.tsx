import { notFound } from 'next/navigation'
import ArmorSetDetails from '@/components/ArmorSetDetails'

import { getArmorSet, getStaticParams } from '@/utils/catalog'

type Props = { params: Promise<{ id: string }> }
export const dynamicParams = false
export const generateStaticParams = () => getStaticParams('armorsets')

export async function generateMetadata({ params }: Props) {
  const data = await getArmorSet((await params).id)
  return { title: data?.name || 'Armor Sets' }
}

export default async function Page({ params }: Props) {
  const armorSet = await getArmorSet((await params).id)
  if (!armorSet) notFound()
  return <ArmorSetDetails key={armorSet.id} armorSet={armorSet} />
}
