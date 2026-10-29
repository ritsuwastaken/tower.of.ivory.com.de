import { ItemsPage } from '@/components/ItemsPage'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getItems } from '@/utils/catalog'

export const metadata = { title: 'Miscellaneous' }

export default async function Page() {
  const items = await getItems('etcitem')
  return (
    <SearchParamsBoundary>
      <ItemsPage key="etcitem" type="etcitem" items={items} />
    </SearchParamsBoundary>
  )
}
