import { ArmorSetDetails } from '@/components/ArmorSetDetails'
import { useRouter } from 'next/router'

export default function ArmorSetPage() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return null
  }

  return <ArmorSetDetails id={id as string} />
}
