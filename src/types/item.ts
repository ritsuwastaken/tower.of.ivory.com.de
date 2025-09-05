import { ArmorSet } from './armorset'

export type Item = {
  object_id: number
  object_name: string
  name?: string
  description?: string
  icon?: string[]
  crystal_type?: string
  body_part?: string[]
  physical_defense?: number
  magical_defense?: number
  armor_type?: string
  weight?: number
  mp_bonus?: number
  soulshot_count?: number
  spiritshot_count?: number
  crystallizable?: number
  physical_damage?: number
  magical_damage?: number
  attack_speed?: number
  mp_consume?: number
  weapon_type?: string
  shield_defense?: number
  shield_defense_rate?: number
  base_price?: number
  crystal_count?: number
  sets?: ArmorSet[]
  is_new?: boolean
  is_changed?: boolean
  changes?: {
    [key in Exclude<
      keyof Item,
      'changes' | 'is_new' | 'is_changed' | 'sets'
    >]: {
      old: Item[key]
      new: Item[key]
    }
  }
}
