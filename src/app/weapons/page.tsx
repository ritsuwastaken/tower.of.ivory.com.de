import { ItemsPage } from '@/components/ItemsPage'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getItems } from '@/utils/catalog'

export const metadata = { title: 'Weapons' }

export default async function Page() {
  const items = await getItems('weapon')
  return (
    <SearchParamsBoundary>
      <ItemsPage key="weapon" type="weapon" items={items} />
    </SearchParamsBoundary>
  )
}
