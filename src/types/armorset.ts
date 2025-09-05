import { Item } from './item'

export type ArmorSet = {
  id: string
  name: string
  grade: string
  armor_type: string
  set_bonus: string
  physical_defense?: number
  base_price?: number
  items: Item[]
}
