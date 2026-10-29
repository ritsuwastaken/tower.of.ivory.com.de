import type { Skill } from '@/types'

export const getDefaultItemColumns = (category: string) => {
  const common = {
    icon: true,
    object_name: false,
    name: true,
    description: false,
    crystal_type: false,
    weight: false,
    crystallizable: false,
    base_price: true,
    crystal_count: false,
    is_new: false,
    is_changed: false,
  }

  switch (category) {
    case 'weapon':
      return {
        ...common,
        crystal_type: true,
        crystal_count: true,
        physical_damage: true,
        magical_damage: true,
        attack_speed: false,
        mp_consume: false,
        weapon_type: true,
        soulshot_count: false,
        spiritshot_count: false,
      }
    case 'armor':
      return {
        ...common,
        crystal_type: true,
        crystal_count: true,
        body_part: false,
        physical_defense: true,
        magical_defense: true,
        armor_type: false,
        mp_bonus: false,
        description: true,
      }
    case 'etcitem':
      return {
        ...common,
        weight: true,
        description: true,
      }
    default:
      return common
  }
}

export const defaultSkillColumns: Partial<Record<keyof Skill, boolean>> = {
  icon: true,
  name: true,
  description: true,
  mp_consume: true,
  hp_consume: true,
  reuse_delay: true,
  skill_level: false,
  is_magic: false,
  is_new: false,
  is_changed: false,
}

export const defaultArmorSetColumns = {
  visual: true,
  name: true,
  grade: true,
  physical_defense: true,
  base_price: true,
  items: true,
  bonus_stats: true,
}
