import { Head } from '@/components/Head'
import { ItemsPage } from '@/components/ItemsPage'

export default function Page() {
  return (
    <>
      <Head description="Weapons" />
      <ItemsPage type="weapon" />
    </>
  )
}
