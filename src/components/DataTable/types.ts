import type { ReactNode } from 'react'
import { SortConfig } from '@/utils/pagination'

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

interface SharedFilterProps {
  filters?: FilterConfig[]
  viewMode?: 'table' | 'grid'
  onViewModeChange?: (mode: 'table' | 'grid') => void
}

export interface ColumnSettingsProps {
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (column: string, visible: boolean) => void
  formatColumnName: (column: string) => string
}

export interface FiltersProps extends SharedFilterProps {
  filters: FilterConfig[]
  viewMode: 'table' | 'grid'
  allowGridView?: boolean
}

export interface DataTableProps<T>
  extends SharedFilterProps, ColumnSettingsProps {
  data: T[]
  columns: {
    key: keyof T | string
    label: string
    visible: boolean
  }[]
  isSearchPending?: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onSort: (column: keyof T) => void
  sortConfig: SortConfig<T>
  onRowClick?: (item: T) => void
  renderCell: (item: T, column: keyof T | string) => ReactNode
  noResultsMessage?: string
  onResetFilters?: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  enableGridView?: boolean
}
