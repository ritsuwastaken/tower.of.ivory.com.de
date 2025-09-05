export type Skill = {
  skill_id: number
  name?: string
  description?: string
  icon?: string
  skill_level?: number
  mp_consume?: number
  reuse_delay?: number
  hit_time?: string
  is_magic?: number
  target_type?: string
  operate_type?: number
  hp_consume?: number
  consume_item_id?: number
  consume_item_count?: number
  cast_range?: number
  skill_time?: string
  abnormal_time?: number
  abnormal_id?: number
  animation?: string
  cast_style?: number
  bar_level_main?: number
  bar_level_sub_max?: number
  levels?: Skill[]
  is_new?: boolean
  is_changed?: boolean
  changes?: {
    [key in Exclude<
      keyof Skill,
      'changes' | 'is_new' | 'is_changed' | 'levels'
    >]: {
      old: Skill[key]
      new: Skill[key]
    }
  }
}
