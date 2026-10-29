import type { Item } from '@/types'

const sectionMatchers = Object.entries({
  dropProperties: (key: string) => key.includes('drop'),
  meshTextureProperties: (key: string) =>
    !key.includes('drop') &&
    ['mesh', 'texture', 'projectile'].some((part) => key.includes(part)),
  soundProperties: (key: string) => key.includes('sound'),
  otherProperties: (key: string) =>
    ['consume_type', 'attack_effect'].some((part) => key.includes(part)),
})

export function groupItemProperties(item: Item) {
  const entries = Object.entries(item).map(([key, value]) => ({
    key,
    value,
    normalizedKey: key.toLowerCase(),
  }))
  const priorityKeys = [
    'crystal_type',
    ...(item.body_part?.some((part) => part.toLowerCase().includes('lhand')) &&
    item.shield_defense
      ? ['shield_defense']
      : []),
    'physical_damage',
    'magical_damage',
    'soulshot_count',
    'spiritshot_count',
    'attack_speed',
    'physical_defense',
    'magical_defense',
    'mp_consume',
    'mp_bonus',
    'base_price',
    'crystal_count',
    'weight',
    'weapon_type',
    'body_part',
    'armor_type',
  ]

  return {
    priority: priorityKeys.flatMap((key) => {
      const entry = entries.find(({ normalizedKey }) => normalizedKey === key)
      return entry ? [entry] : []
    }),
    other: entries.filter(
      ({ key, normalizedKey }) =>
        !['icon', 'name', 'description'].includes(key) &&
        !['sets', 'is_new', 'is_changed', 'changes'].includes(normalizedKey) &&
        !priorityKeys.includes(normalizedKey) &&
        !sectionMatchers.some(([, matches]) => matches(normalizedKey)),
    ),
    sections: sectionMatchers
      .map(([id, matches]) => ({
        id,
        entries: entries.filter(({ normalizedKey }) => matches(normalizedKey)),
      }))
      .filter(({ entries }) => entries.length > 0),
  }
}
