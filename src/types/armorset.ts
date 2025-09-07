import { Item } from './item'

export type ArmorSet = {
  id: string
  name: string
  grade: string
  armor_type: string
  set_bonus: string
  physical_defense?: number
  bonus_stats?: string
  base_price?: number
  items: Item[]
}
