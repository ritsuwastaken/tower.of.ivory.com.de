import type { Field, FieldType, Schema } from 'l2asmdisasm'

type JsonSchema = Record<string, unknown>

const U32_MAX = 4294967295

const RANGES: Partial<Record<FieldType, [number, number]>> = {
  u8: [0, 255],
  i8: [-128, 127],
  u16: [0, 65535],
  i16: [-32768, 32767],
  u32: [0, U32_MAX],
  i32: [-2147483648, 2147483647],
  compact: [-2147483648, 2147483647],
  padding: [0, 255],
}

function fieldKeys(fields: Field[]) {
  const reserved = new Set(fields.map((field) => field.name))
  const used = new Set<string>()
  return fields.map((field) => {
    let key = field.name
    for (let suffix = 2; used.has(key); suffix++) {
      key = `${field.name}#${suffix}`
      while (reserved.has(key)) key += '#'
    }
    used.add(key)
    return key
  })
}

const integer = ([minimum, maximum]: [number, number]): JsonSchema => ({
  type: 'integer',
  minimum,
  maximum,
})

function text(field: Field): JsonSchema {
  const content =
    field.format === 'id-list'
      ? {
          anyOf: [
            { type: 'array', items: integer([0, U32_MAX]) },
            { type: 'string' },
          ],
        }
      : { type: 'string' }
  return {
    anyOf: [
      content,
      {
        type: 'object',
        properties: {
          value: content,
          ...(field.type === 'string' && {
            encoding: { enum: ['byte', 'utf16'] },
          }),
          terminated: { type: 'boolean' },
        },
        required: ['value'],
        additionalProperties: false,
      },
    ],
  }
}

function value(field: Field, counters: Set<string>): JsonSchema {
  if (field.type === 'group') return record(field.members, counters)
  if (field.format === 'name-ref')
    return {
      anyOf: [
        integer(RANGES[field.type] ?? [0, U32_MAX]),
        {
          type: 'object',
          properties: {
            index: integer([0, U32_MAX]),
            value: { type: 'string' },
          },
          required: ['value'],
          additionalProperties: false,
        },
      ],
    }
  switch (field.type) {
    case 'string':
    case 'utf16':
      return text(field)
    case 'i64':
      return { type: 'string', pattern: '^-?(0|[1-9][0-9]*)$' }
    case 'f32':
    case 'f64':
      return {
        anyOf: [
          { type: 'number' },
          {
            type: 'object',
            properties: {
              bits: { type: 'string', pattern: '^0[xX][0-9a-fA-F]+$' },
            },
            required: ['bits'],
            additionalProperties: false,
          },
        ],
      }
    default:
      return integer(RANGES[field.type] ?? [0, U32_MAX])
  }
}

function property(field: Field, counters: Set<string>): JsonSchema {
  const item = value(field, counters)
  const description = `${field.type}${field.array ? `[${field.counter || field.count}]` : ''}`
  if (!field.array) return { ...item, description }
  return {
    type: 'array',
    items: item,
    description,
    ...(!field.counter && { minItems: field.count, maxItems: field.count }),
  }
}

function record(fields: Field[], counters: Set<string>): JsonSchema {
  const keys = fieldKeys(fields)
  return {
    type: 'object',
    properties: Object.fromEntries(
      fields.map((field, i) => [keys[i], property(field, counters)]),
    ),
    required: keys.filter(
      (_, i) => !fields[i].enabledBy.length && !counters.has(fields[i].name),
    ),
    additionalProperties: false,
  }
}

function collectCounters(fields: Field[], counters = new Set<string>()) {
  for (const field of fields) {
    if (field.counter) counters.add(field.counter)
    collectCounters(field.members, counters)
  }
  return counters
}

export function datJsonSchema(schema: Schema): JsonSchema {
  const blocks = schema.blocks.map((block) => ({
    type: 'array',
    items: record(block.fields, collectCounters(block.fields)),
  }))
  if (blocks.length === 1) return blocks[0]
  return {
    type: 'object',
    properties: {
      blocks: {
        type: 'array',
        items: blocks,
        minItems: blocks.length,
        maxItems: blocks.length,
      },
    },
    required: ['blocks'],
    additionalProperties: false,
  }
}
