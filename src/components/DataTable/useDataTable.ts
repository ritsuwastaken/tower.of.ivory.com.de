import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { SortConfig } from '@/utils/pagination'
import { useCatalogSearchParams } from '@/components/SearchParamsBoundary'
import {
  startTransition,
  addTransitionType,
  useCallback,
  useDeferredValue,
  useState,
} from 'react'

interface UseDataTableOptions {
  itemsPerPage?: number
  defaultColumnVisibility?: Record<string, boolean>
  columnLabels?: Record<string, string>
  onResetFilters?: () => void
}

export function useDataTable<T>({
  itemsPerPage = 50,
  defaultColumnVisibility = {},
  onResetFilters,
  columnLabels,
}: UseDataTableOptions = {}) {
  const formatColumnName = useFormatColumnName()
  const searchParams = useCatalogSearchParams()
  const searchTerm = searchParams.get('search') || ''
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get('page') || '1', 10) || 1,
  )
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    column: null,
    direction: 'asc',
  })
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility,
  )

  const updateParams = useCallback(
    (update: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(window.location.search)
      update(params)
      const query = params.toString()
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
      )
    },
    [],
  )

  const handleSort = useCallback((column: keyof T) => {
    startTransition(() => {
      addTransitionType('table-sort')
      setSortConfig((prev) => ({
        column,
        direction:
          prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
      }))
    })
  }, [])

  const handleColumnVisibilityChange = useCallback(
    (column: string, visible: boolean) => {
      setColumnVisibility((prev) => ({ ...prev, [column]: visible }))
    },
    [],
  )

  const handleViewModeChange = useCallback(
    (mode: 'table' | 'grid') => {
      updateParams((params) => params.set('view', mode))
    },
    [updateParams],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams((params) => {
        if (page > 1) params.set('page', String(page))
        else params.delete('page')
      })
    },
    [updateParams],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      updateParams((params) => {
        if (value) params.set('search', value)
        else params.delete('search')
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleResetFilters = useCallback(() => {
    updateParams((params) => {
      params.delete('search')
      params.delete('page')
    })
    setColumnVisibility(defaultColumnVisibility)
    onResetFilters?.()
  }, [updateParams, defaultColumnVisibility, onResetFilters])

  const viewMode = useDeferredValue<'table' | 'grid'>(
    searchParams.get('view') === 'grid' ? 'grid' : 'table',
  )

  return {
    deferredSearchTerm,
    itemsPerPage,
    tableProps: {
      searchTerm,
      isSearchPending: searchTerm !== deferredSearchTerm,
      currentPage,
      sortConfig,
      columnVisibility,
      formatColumnName,
      columns: Object.entries(columnVisibility).map(([key, visible]) => ({
        key,
        visible,
        label:
          columnLabels?.[key] ?? (key === 'icon' ? '' : formatColumnName(key)),
      })),
      viewMode,
      onSort: handleSort,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onViewModeChange: handleViewModeChange,
      onPageChange: handlePageChange,
      onSearchChange: handleSearchChange,
      onResetFilters: handleResetFilters,
    },
  }
}
