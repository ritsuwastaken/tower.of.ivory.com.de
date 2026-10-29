import { useTranslation } from '@/hooks/useTranslation'
import { ViewTransition } from 'react'
import styled from 'styled-components'
import { Pagination } from '../Pagination'
import { Filters } from './Filters'
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
  checkboxFilters = [],
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
        <FiltersContainer>
          <SearchAndFiltersContainer>
            <SearchInput
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                searchPlaceholder || t('dataTable.searchPlaceholder')
              }
            />
            <Filters
              filters={filters}
              checkboxFilters={checkboxFilters}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={onColumnVisibilityChange}
              formatColumnName={formatColumnName}
              viewMode={effectiveViewMode}
              onViewModeChange={enableGridView ? onViewModeChange : undefined}
              allowGridView={enableGridView}
            />
          </SearchAndFiltersContainer>
        </FiltersContainer>
        {(filters.some((f) => f.value !== '') ||
          checkboxFilters.some((f) => f.checked)) && (
          <TagsContainer>
            {filters
              .filter((filter) => filter.value !== '')
              .map((filter) => (
                <Tag key={filter.id}>
                  {filter.label}:{' '}
                  {
                    filter.options.find((opt) => opt.value === filter.value)
                      ?.label
                  }
                  <TagRemoveButton onClick={() => filter.onChange('')}>
                    ×
                  </TagRemoveButton>
                </Tag>
              ))}
            {checkboxFilters
              .filter((filter) => filter.checked)
              .map((filter) => (
                <Tag key={filter.id}>
                  {filter.label}
                  <TagRemoveButton onClick={filter.onChange}>×</TagRemoveButton>
                </Tag>
              ))}
          </TagsContainer>
        )}
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
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;

  @media (max-width: 890px) {
    padding: 0.5rem;
    border-radius: 4px;
  }
`

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
`

const SearchAndFiltersContainer = styled.div`
  anchor-name: --table-filters;
  anchor-scope: --table-filters;
  display: flex;
  gap: 1rem;
  flex: 1;
  position: relative;

  @media (max-width: 890px) {
    gap: 0.5rem;
  }
`

const SearchInput = styled.input.attrs({
  type: 'search',
})`
  flex: 1;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;

  @media (max-width: 890px) {
    padding: 0.5rem;
  }

  &:focus {
    outline: none;
    border-color: #5a5a5a;
  }
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #fff;
`

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
  }
`

const ResultsContainer = styled.div<{ $isStale: boolean }>`
  opacity: ${({ $isStale }) => ($isStale ? 0.6 : 1)};
`
