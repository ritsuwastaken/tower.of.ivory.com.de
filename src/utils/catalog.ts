import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ArmorSet, Item, Skill } from '@/types'
import { sumProperty } from './sumProperty'

type Datasets = {
  weapon: Item[]
  armor: Item[]
  etcitem: Item[]
  skills: Skill[]
  armorsets: ArmorSet[]
}

type ItemDataset = 'weapon' | 'armor' | 'etcitem'

const datasets = new Map<keyof Datasets, Promise<Datasets[keyof Datasets]>>()

async function readDataset<K extends keyof Datasets>(
  name: K,
): Promise<Datasets[K]> {
  let records = datasets.get(name)
  if (!records) {
    records = readFile(
      join(process.cwd(), 'public', 'data', `${name}.json`),
      'utf8',
    ).then((json) => JSON.parse(json))
    if (process.env.NODE_ENV === 'production') datasets.set(name, records)
  }
  return records as Promise<Datasets[K]>
}

function pickFields<T extends object, K extends keyof T>(
  record: T,
  fields: readonly K[],
): Pick<T, K> {
  return Object.fromEntries(
    fields
      .filter((field) => field in record)
      .map((field) => [field, record[field]]),
  ) as Pick<T, K>
}

const itemListFields = [
  'object_id',
  'object_name',
  'name',
  'description',
  'icon',
  'crystal_type',
  'body_part',
  'physical_defense',
  'magical_defense',
  'armor_type',
  'weight',
  'mp_bonus',
  'soulshot_count',
  'spiritshot_count',
  'crystallizable',
  'physical_damage',
  'magical_damage',
  'attack_speed',
  'mp_consume',
  'weapon_type',
  'base_price',
  'crystal_count',
  'is_new',
  'is_changed',
] as const satisfies readonly (keyof Item)[]

const skillListFields = [
  'skill_id',
  'skill_level',
  'name',
  'description',
  'icon',
  'mp_consume',
  'hp_consume',
  'reuse_delay',
  'is_magic',
  'is_new',
  'is_changed',
] as const satisfies readonly (keyof Skill)[]

const armorSetItemListFields = [
  'object_id',
  'object_name',
  'name',
  'icon',
  'body_part',
  'armor_type',
  'weapon_type',
] as const satisfies readonly (keyof Item)[]

export async function getStaticParams(dataset: keyof Datasets) {
  const records = await readDataset(dataset)
  const ids = new Set(
    records.map((record) =>
      String(
        'object_id' in record
          ? record.object_id
          : 'skill_id' in record
            ? record.skill_id
            : record.id,
      ),
    ),
  )
  return [...ids].map((id) => ({ id }))
}

export async function getItems(dataset: ItemDataset): Promise<Item[]> {
  return (await readDataset(dataset)).map((item) =>
    pickFields(item, itemListFields),
  )
}

export async function getSkills(): Promise<Skill[]> {
  return (await readDataset('skills')).map((skill) =>
    pickFields(skill, skillListFields),
  )
}

export async function getArmorSets(): Promise<ArmorSet[]> {
  return (await readDataset('armorsets')).map((set) => ({
    ...set,
    physical_defense: sumProperty(set.items, 'physical_defense'),
    base_price: sumProperty(set.items, 'base_price'),
    items: set.items.map((item) => pickFields(item, armorSetItemListFields)),
  }))
}

export async function getItem(
  dataset: ItemDataset,
  id: string,
): Promise<Item | undefined> {
  const item = (await readDataset(dataset)).find(
    (record) => String(record.object_id) === id,
  )
  if (!item) return undefined
  const sets = (await readDataset('armorsets')).filter((set) =>
    set.items.some((part) => part.object_id === item.object_id),
  )
  return { ...item, sets }
}

export async function getSkill(id: string): Promise<Skill | undefined> {
  const levels = (await readDataset('skills')).filter(
    (skill) => String(skill.skill_id) === id,
  )
  const skill = levels[0]
  return skill ? { ...skill, levels } : undefined
}

export async function getArmorSet(id: string): Promise<ArmorSet | undefined> {
  return (await readDataset('armorsets')).find((set) => String(set.id) === id)
}
