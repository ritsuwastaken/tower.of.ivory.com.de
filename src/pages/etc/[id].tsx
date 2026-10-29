import { getStaticPathsFor } from '@/utils/staticPages'
import { ItemDetails } from '@/components/ItemDetails'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return null
  }

  return <ItemDetails id={parseInt(id as string, 10)} />
}

export { getStaticProps } from '@/utils/staticPages'

export const getStaticPaths = getStaticPathsFor('etcitem')
