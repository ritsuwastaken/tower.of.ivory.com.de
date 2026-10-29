import { Item } from '@/types'

export function getItemUrl(item: Item): string {
  const route = item.armor_type ? 'armor' : item.weapon_type ? 'weapons' : 'etc'
  return `/${route}/${item.object_id}`
}
