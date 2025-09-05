import { SkillDetails } from '@/components/SkillDetails'
import { useRouter } from 'next/router'

export default function SkillPage() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return null
  }

  return <SkillDetails id={parseInt(id as string, 10)} />
}
