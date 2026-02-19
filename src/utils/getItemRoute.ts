import { Item } from '@/types/item'

export function getItemRoutePath(item: Item): 'weapons' | 'armor' | 'etc' {
  if (item.armor_type) {
    return 'armor'
  }
  if (item.weapon_type) {
    return 'weapons'
  }
  return 'etc'
}

export function getItemUrl(item: Item): string {
  const route = getItemRoutePath(item)
  return `/${route}/${item.object_id}`
}
