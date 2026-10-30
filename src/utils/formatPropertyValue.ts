export function formatPropertyValue(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(formatPropertyValue).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value)
  }
  return ''
}
