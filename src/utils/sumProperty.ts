export function sumProperty<T>(items: T[], property: keyof T): number {
  if (!Array.isArray(items)) return 0
  return items.reduce((total, item) => total + (Number(item[property]) || 0), 0)
}
