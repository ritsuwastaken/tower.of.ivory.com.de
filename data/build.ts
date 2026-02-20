import fs from 'fs'
import path from 'path'

const root = process.cwd()
const dataDir = path.join(root, 'public', 'data')
const raw = {
  client: path.join(root, 'data/custom'),
  clientOrig: path.join(root, 'data/original'),
  sets: path.join(root, 'data/sets.json'),
  itemdata: path.join(root, 'data/itemdata.json'),
}

const read = (p: string) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : '')
const readJson = <T>(p: string): T => JSON.parse(fs.readFileSync(p, 'utf-8'))
const writeJson = (p: string, data: unknown) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

const clean = (s: string) => s.replace(/^\[|\]$/g, '')
const parseVal = (v: string): number | boolean | string | string[] => {
  if (v.startsWith('{')) return v.slice(1, -1).split(';').map(clean)
  const s = clean(v)
  if (/^\d+$/.test(s)) return parseInt(s, 10)
  if (s === 'true') return true
  if (s === 'false') return false
  return s
}

const parseBlock = (content: string, begin: string, req1: string, req2?: string) => {
  const out: any[] = []
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || !line.startsWith(begin)) continue
    const o: any = {}
    for (const part of line.split('\t')) {
      if (!part) continue
      const [k, v] = part.split('=')
      if (k && v) o[k.trim()] = parseVal(v.trim())
    }
    if (req1 in o && (!req2 || req2 in o)) out.push(o)
  }
  return out
}

const parseName = (content: string, begin: string, idKey: string, nameKey: string, descKey: string, lvlKey?: string) => {
  const m = new Map<string, any>()
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || !line.startsWith(begin)) continue
    const o: any = {}
    for (const part of line.split('\t')) {
      if (!part) continue
      const [k, v] = part.split('=')
      if (!v) continue
      const key = k.trim()
      const val = v.trim()
      if (key === idKey) o.id = parseInt(val, 10)
      else if (key === nameKey) o.name = clean(val)
      else if (key === descKey) o.description = clean(val)
      else if (lvlKey && key === lvlKey) o.level = parseInt(val, 10)
    }
    const id = o.id?.toString()
    if (!id) continue
    const mapKey = lvlKey && o.level != null ? `${id}_${o.level}` : id
    m.set(mapKey, o)
  }
  return m
}

const diff = (orig: any, cur: any) => {
  const changes: any = {}
  for (const k of Object.keys(cur)) {
    if (k in orig && JSON.stringify(orig[k]) !== JSON.stringify(cur[k])) {
      changes[k] = { old: orig[k], new: cur[k] }
    }
  }
  return { isNew: !orig || Object.keys(orig).length === 0, isChanged: Object.keys(changes).length > 0, changes }
}

const lowerIcons = (o: any) => {
  if (Array.isArray(o.icon)) o.icon = o.icon.map((x: any) => (typeof x === 'string' ? x.toLowerCase() : x))
  return o
}

function runClient() {
  const itemdata = readJson<any[]>(raw.itemdata)
  const itemNames = parseName(read(path.join(raw.client, 'itemname-e.txt')), 'item_name_begin', 'id', 'name', 'description')
  const origItemNames = parseName(read(path.join(raw.clientOrig, 'itemname-e.txt')), 'item_name_begin', 'id', 'name', 'description')

  const process = (type: string) => {
    const cur = parseBlock(read(path.join(raw.client, `${type}grp.txt`)), 'item_begin', 'object_id', 'object_name')
    const orig = parseBlock(read(path.join(raw.clientOrig, `${type}grp.txt`)), 'item_begin', 'object_id', 'object_name')
    const origMap = new Map<number, any>()
    for (const o of orig) origMap.set(o.object_id, o)

    const out = cur.map((it) => {
      const x: any = { ...lowerIcons({ ...it }) }
      const pr = itemdata[it.object_id]
      if (pr?.default_price != null) x.base_price = pr.default_price
      if (pr?.crystal_count != null) x.crystal_count = pr.crystal_count
      const d = diff(origMap.get(it.object_id) || {}, it)
      x.is_new = d.isNew
      x.is_changed = d.isChanged
      if (Object.keys(d.changes).length) x.changes = d.changes
      const nm = itemNames.get(String(it.object_id))
      const on = origItemNames.get(String(it.object_id))
      if (nm) {
        const nd = on
          ? diff({ name: on.name, description: on.description }, { name: nm.name, description: nm.description })
          : { isChanged: false, changes: {} }
        if (nd.isChanged && Object.keys(nd.changes).length) {
          x.changes = { ...(x.changes || {}), ...nd.changes }
          x.is_changed = true
        }
        x.name = nm.name
        x.description = nm.description
      }
      return x
    })

    writeJson(path.join(dataDir, `${type}.json`), out)
    console.log(`client: ${type} ${out.length} items`)
  }

  process('armor')
  process('weapon')
  process('etcitem')

  const skills = parseBlock(read(path.join(raw.client, 'skillgrp.txt')), 'skill_begin', 'skill_id', 'skill_level')
  const skillNames = parseName(read(path.join(raw.client, 'skillname-e.txt')), 'skill_begin', 'skill_id', 'name', 'desc', 'skill_level')
  const origSkills = parseBlock(read(path.join(raw.clientOrig, 'skillgrp.txt')), 'skill_begin', 'skill_id', 'skill_level')
  const origSkillNames = parseName(read(path.join(raw.clientOrig, 'skillname-e.txt')), 'skill_begin', 'skill_id', 'name', 'desc', 'skill_level')
  const origMap = new Map<string, any>()
  for (const s of origSkills) origMap.set(`${s.skill_id}_${s.skill_level}`, s)

  const sk = skills.map((s) => {
    const key = `${s.skill_id}_${s.skill_level}`
    const { name: _n, description: _d, ...rest } = s as any
    const x: any = { ...lowerIcons({ ...rest }) }
    const d = diff(origMap.get(key) || {}, s)
    x.is_new = d.isNew
    x.is_changed = d.isChanged
    if (Object.keys(d.changes).length) x.changes = d.changes
    const nm = skillNames.get(key)
    const on = origSkillNames.get(key)
    if (nm) {
      const nd = on
        ? diff({ name: on.name, description: on.description || '' }, { name: nm.name, description: nm.description || '' })
        : { isChanged: false, changes: {} }
      if (nd.isChanged && Object.keys(nd.changes).length) {
        x.changes = { ...(x.changes || {}), ...nd.changes }
        x.is_changed = true
      }
      x.name = nm.name
      x.description = nm.description
    }
    return x
  })

  writeJson(path.join(dataDir, 'skills.json'), sk)
  console.log(`client: skills ${sk.length}`)
}

function runCustom() {
  const armor = readJson<any[]>(path.join(dataDir, 'armor.json'))
  const weapon = readJson<any[]>(path.join(dataDir, 'weapon.json'))
  const sets = readJson<any[]>(raw.sets)
  const map = new Map<string, any>()
  for (const a of armor) map.set(a.object_name, a)
  for (const w of weapon) map.set(w.object_name, w)

  const isChest = (x: any) => x && Array.isArray(x.body_part) && x.body_part.some((p: any) => String(p).toLowerCase().includes('chest'))
  const bonus = (d?: string) => (d ? d.split('|').slice(1).join('|') : '')

  const out = sets.map((s) => {
    const items = s.items.map((n: string) => map.get(n))
    const chest = items.find(isChest)
    return {
      id: s.id,
      name: s.name,
      armor_type: chest?.armor_type ?? 'light',
      grade: chest?.crystal_type?.trim() || 'none',
      set_bonus: bonus(chest?.description),
      items,
    }
  })

  writeJson(path.join(dataDir, 'armorsets.json'), out)
  console.log(`custom: ${out.length} sets → data/armorsets.json`)
}

runClient();
runCustom();
