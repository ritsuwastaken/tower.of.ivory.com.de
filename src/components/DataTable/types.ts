interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export interface FiltersProps {
  isLoading: boolean
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  filters: FilterConfig[]
  checkboxFilters: {
    id: string
    label: string
    checked: boolean
    onChange: () => void
  }[]
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (column: string, visible: boolean) => void
  formatColumnName: (column: string) => string
  viewMode: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
}

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export interface DataTableProps<T> {
  data: T[]
  columns: {
    key: keyof T | string
    label: string
    visible: boolean
  }[]
  isLoading: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onSort: (column: keyof T) => void
  sortConfig: {
    column: keyof T | null
    direction: 'asc' | 'desc'
  }
  onRowClick?: (item: T) => void
  renderCell: (item: T, column: keyof T | string) => React.ReactNode
  noResultsMessage?: string
  onResetFilters?: () => void
  filters?: FilterConfig[]
  checkboxFilters?: {
    id: string
    label: string
    checked: boolean
    onChange: () => void
  }[]
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (column: string, visible: boolean) => void
  formatColumnName: (column: string) => string
  viewMode?: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
