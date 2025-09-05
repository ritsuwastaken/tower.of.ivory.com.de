const sumPropertyValues = <T, K extends keyof T>(
  items: T[],
  property: K,
): number => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((total, item) => total + (Number(item[property]) || 0), 0)
}

export const getTotalPhysicalDefense = <
  T extends { physical_defense?: number },
>(
  items: T[],
): number => sumPropertyValues(items, 'physical_defense')

export const getTotalBasePrice = <T extends { base_price?: number }>(
  items: T[],
): number => sumPropertyValues(items, 'base_price')
