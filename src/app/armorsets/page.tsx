import ArmorSetsPage from '@/components/ArmorSetsPage'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getArmorSets } from '@/utils/catalog'

export const metadata = { title: 'Armor Sets' }

export default async function Page() {
  const data = await getArmorSets()
  return (
    <SearchParamsBoundary>
      <ArmorSetsPage armorSets={data} />
    </SearchParamsBoundary>
  )
}
