import { Item } from '@/types/item'
import { getDataUrl } from '@/utils/dataUrl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Legacy URL handling
export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id || ''

  useEffect(() => {
    const run = async () => {
      try {
        const [weaponsRes, armorRes, etcRes] = await Promise.all([
          fetch(getDataUrl('/data/weapon.json')),
          fetch(getDataUrl('/data/armor.json')),
          fetch(getDataUrl('/data/etcitem.json')),
        ])
        if (!weaponsRes.ok || !armorRes.ok || !etcRes.ok) {
          throw new Error('Failed')
        }
        const [weapons, armors, etcitems] = await Promise.all([
          weaponsRes.json(),
          armorRes.json(),
          etcRes.json(),
        ])
        const numericId = Number(id)
        const found =
          armors.find((i: Item) => i.object_id === numericId) ||
          weapons.find((i: Item) => i.object_id === numericId) ||
          etcitems.find((i: Item) => i.object_id === numericId)
        if (!found) throw new Error('Not found')
        const path = found.armor_type
          ? 'armor'
          : found.weapon_type
            ? 'weapons'
            : 'etc'
        router.replace(`/${path}/${id}`)
      } catch {
        router.replace('/404')
      }
    }
    run()
  }, [router, id])

  return null
}
