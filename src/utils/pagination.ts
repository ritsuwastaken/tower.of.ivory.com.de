export interface SortConfig<T> {
  column: keyof T | null
  direction: 'asc' | 'desc'
}

const gradeOrder: Record<string, number> = {
  none: 0,
  d: 1,
  c: 2,
  b: 3,
  a: 4,
  s: 5,
}

export function sortData<T>(
  data: T[],
  { column, direction }: SortConfig<T>,
  gradeColumn?: keyof T,
): T[] {
  return [...data].sort((a, b) => {
    if (!column) return 0
    const aValue = a[column]
    const bValue = b[column]
    if (aValue === bValue) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    const result =
      column === gradeColumn
        ? (gradeOrder[String(aValue || 'none').toLowerCase()] ?? 0) -
          (gradeOrder[String(bValue || 'none').toLowerCase()] ?? 0)
        : typeof aValue === 'string'
          ? aValue.localeCompare(bValue as string)
          : Number(aValue) - Number(bValue)
    return direction === 'asc' ? result : -result
  })
}

export function paginateData<T>(data: T[], page: number, itemsPerPage: number) {
  return {
    data: data.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    totalPages: Math.ceil(data.length / itemsPerPage),
  }
}
