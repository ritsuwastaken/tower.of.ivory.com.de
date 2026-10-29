import { ItemsPage } from '@/components/ItemsPage'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getItems } from '@/utils/catalog'

export const metadata = { title: 'Armor' }

export default async function Page() {
  const items = await getItems('armor')
  return (
    <SearchParamsBoundary>
      <ItemsPage key="armor" type="armor" items={items} />
    </SearchParamsBoundary>
  )
}
