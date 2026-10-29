export type ChangeFilter = 'all' | 'new' | 'changed'

export function matchesChangeFilter(
  record: { is_new?: boolean; is_changed?: boolean },
  filter: ChangeFilter,
) {
  return (
    filter === 'all' ||
    (filter === 'new' ? record.is_new : record.is_changed) === true
  )
}

export function getFilterOptions(
  values: (string | undefined)[],
  allLabel: string,
) {
  const unique = [
    ...new Set(
      values
        .filter((value): value is string => !!value)
        .map((value) => value.toLowerCase()),
    ),
  ].sort()
  return [
    { value: '', label: allLabel },
    ...unique.map((value) => ({
      value,
      label: value
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    })),
  ]
}
