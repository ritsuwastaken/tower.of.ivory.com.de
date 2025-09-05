import { useRouter } from 'next/router'
import { useEffect } from 'react'

const urlMap = {
  weapon: '/weapons',
  armor: '/armor',
  etcitem: '/etc',
}
const availableTypes = Object.keys(urlMap)

// Legacy URL handling
export default function Page() {
  const router = useRouter()
  const { type } = router.query
  const currentType = availableTypes.includes(type as string)
    ? (type as string)
    : 'weapon'

  useEffect(() => {
    router.replace(urlMap[currentType as keyof typeof urlMap])
  }, [currentType, router])

  return null
}
