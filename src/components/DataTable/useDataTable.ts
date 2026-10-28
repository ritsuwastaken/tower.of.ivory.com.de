import { SortConfig } from '@/utils/tableData'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDataTableOptions {
  itemsPerPage?: number
  defaultColumnVisibility?: Record<string, boolean>
  onResetFilters?: () => void
}

export function useDataTable<T>({
  itemsPerPage = 50,
  defaultColumnVisibility = {},
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
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    column: null,
    direction: 'asc',
  })
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility,
  )

  const handleSort = useCallback((column: keyof T) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const handleColumnVisibilityChange = useCallback(
    (column: string, visible: boolean) => {
      setColumnVisibility((prev) => ({ ...prev, [column]: visible }))
    },
    [],
  )

  const handleViewModeChange = useCallback(
    (mode: 'table' | 'grid') => {
      const params = new URLSearchParams(searchParams)
      params.set('view', mode)
      router.replace(`${pathname}?${params}`, {
        scroll: false,
      })
    },
    [router, pathname, searchParams],
  )

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
    onResetFilters?.()
  }, [defaultColumnVisibility, onResetFilters])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams(searchParams)

    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }

    if (currentPage > 1) {
      params.set('page', currentPage.toString())
    } else {
      params.delete('page')
    }

    const newUrl = `${pathname}?${params.toString()}`
    const currentUrl = `${pathname}?${searchParams.toString()}`

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [searchTerm, currentPage, pathname, router, searchParams])

  const viewMode: 'table' | 'grid' =
    searchParams.get('view') === 'grid' ? 'grid' : 'table'

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
