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
        [
        key in Exclude<keyof Item, 'changes' | 'is_new' | 'is_changed' | 'sets'>
        ]: {
            old: Item[key]
            new: Item[key]
        }
    }
}

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
        [
        key in Exclude<
            keyof Skill,
            'changes' | 'is_new' | 'is_changed' | 'levels'
        >
        ]: {
            old: Skill[key]
            new: Skill[key]
        }
    }
}
