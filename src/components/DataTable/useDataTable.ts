import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDataTableOptions {
  itemsPerPage?: number
  defaultColumnVisibility?: Record<string, boolean>
  defaultViewMode?: 'table' | 'grid'
  onResetFilters?: () => void
}

export function useDataTable<T>({
  itemsPerPage = 50,
  defaultColumnVisibility = {},
  defaultViewMode = 'table',
  onResetFilters,
}: UseDataTableOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  )
  const [sortConfig, setSortConfig] = useState<{
    column: keyof T | null
    direction: 'asc' | 'desc'
  }>({ column: null, direction: 'asc' })
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility,
  )
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(defaultViewMode)

  const handleSort = useCallback(
    (column: keyof T) => {
      setSortConfig({
        column,
        direction:
          sortConfig.column === column && sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc',
      })
    },
    [sortConfig],
  )

  const handleColumnVisibilityChange = useCallback(
    (column: string, visible: boolean) => {
      setColumnVisibility((prev) => ({ ...prev, [column]: visible }))
    },
    [],
  )

  const handleViewModeChange = useCallback((mode: 'table' | 'grid') => {
    setViewMode(mode)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSearchTerm('')
    setCurrentPage(1)
    setColumnVisibility(defaultColumnVisibility)
    setViewMode(defaultViewMode)
    onResetFilters?.()
  }, [defaultColumnVisibility, defaultViewMode, onResetFilters])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams()

    if (searchTerm) params.set('search', searchTerm)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (viewMode !== defaultViewMode) params.set('view', viewMode)

    const newUrl = `${pathname}?${params.toString()}`
    const currentUrl = `${pathname}?${searchParams.toString()}`

    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [
    searchTerm,
    currentPage,
    viewMode,
    pathname,
    router,
    searchParams,
    defaultViewMode,
  ])

  useEffect(() => {
    const viewFromParams = searchParams.get('view') as 'table' | 'grid' | null
    if (viewFromParams && ['table', 'grid'].includes(viewFromParams)) {
      setViewMode(viewFromParams)
    }
  }, [searchParams])

  return {
    searchTerm,
    currentPage,
    sortConfig,
    columnVisibility,
    viewMode,
    itemsPerPage,
    handleSort,
    handleColumnVisibilityChange,
    handleViewModeChange,
    handlePageChange,
    handleSearchChange,
    handleResetFilters,
  }
}
