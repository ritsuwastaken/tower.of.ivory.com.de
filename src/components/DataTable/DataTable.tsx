import { useTranslation } from '@/hooks/useTranslation'
import { ViewTransition } from 'react'
import styled from 'styled-components'
import { Pagination } from '../Pagination'
import { Filters } from './Filters'
import { controlStyles } from '../Control.styles'
import { DataTableProps } from './types'
import { TableResults } from './Results'

export function DataTable<T>({
  data,
  columns,
  isSearchPending = false,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  onSort,
  sortConfig,
  onRowClick,
  renderCell,
  noResultsMessage,
  onResetFilters,
  filters = [],
  columnVisibility,
  onColumnVisibilityChange,
  formatColumnName,
  viewMode = 'table',
  onViewModeChange,
  currentPage,
  totalPages,
  onPageChange,
  enableGridView = false,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const effectiveViewMode = enableGridView ? viewMode : 'table'
  const pagination = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages || 1}
      onPageChange={onPageChange}
    />
  )

  function renderInputWithFilters() {
    return (
      <FiltersWrapper>
        <SearchInput
          aria-label={searchPlaceholder || t('dataTable.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder || t('dataTable.searchPlaceholder')}
        />
        <Filters
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          formatColumnName={formatColumnName}
          filters={filters}
          viewMode={effectiveViewMode}
          onViewModeChange={enableGridView ? onViewModeChange : undefined}
          allowGridView={enableGridView}
        />
      </FiltersWrapper>
    )
  }
  return (
    <Container>
      {renderInputWithFilters()}
      {pagination}
      <ViewTransition
        key={effectiveViewMode}
        update={{ default: 'none', 'table-sort': 'auto' }}
      >
        <ResultsContainer
          aria-busy={isSearchPending}
          $isStale={isSearchPending}
        >
          <TableResults
            data={data}
            columns={columns}
            onSort={onSort}
            sortConfig={sortConfig}
            onRowClick={onRowClick}
            renderCell={renderCell}
            noResultsMessage={noResultsMessage}
            onResetFilters={onResetFilters}
            viewMode={effectiveViewMode}
          />
        </ResultsContainer>
      </ViewTransition>
      {pagination}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.panel};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.table}) {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.control};
  }
`

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SearchInput = styled.input.attrs({
  type: 'search',
})`
  ${controlStyles}
  width: 100%;
  height: var(--control-height);

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`

const ResultsContainer = styled.div<{ $isStale: boolean }>`
  opacity: ${({ $isStale }) => ($isStale ? 0.6 : 1)};
`
