import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { Pagination } from '../Pagination'
import { Filters } from './Filters'
import { DataTableProps } from './types'

export function DataTable<T>({
  data,
  columns,
  isLoading,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  onSort,
  sortConfig,
  onRowClick,
  renderCell,
  noResultsMessage = 'No results found',
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
}: DataTableProps<T>) {
  const [showFilters, setShowFilters] = useState(false)
  const visibleColumns = columns.filter((col) => col.visible)
  const pagination = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages || 1}
      onPageChange={onPageChange}
      disabled={isLoading}
    />
  )

  return (
    <Container>
      {renderInputWithFilters()}
      {pagination}
      {isLoading
        ? renderLoading()
        : data.length > 0
          ? renderData()
          : renderNoResults()}
      {pagination}
    </Container>
  )

  function renderInputWithFilters() {
    return (
      <FiltersWrapper>
        <FiltersContainer>
          <SearchAndFiltersContainer>
            <SearchInput
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || 'Search...'}
            />
            <Filters
              isLoading={isLoading}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              checkboxFilters={checkboxFilters}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={onColumnVisibilityChange}
              formatColumnName={formatColumnName}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
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

  function renderLoading() {
    return viewMode === 'table' ? (
      <Table>
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <Th key={column.key as string}>{column.label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <SkeletonRow key={index}>
                {visibleColumns.map((column) => (
                  <Td key={column.key as string} data-key={column.key}>
                    {column.key === 'visual' ? (
                      <SkeletonVisual />
                    ) : column.key === 'icon' ? (
                      <SkeletonIcon />
                    ) : column.key === 'description' ? (
                      <SkeletonDescription />
                    ) : (
                      <SkeletonCell />
                    )}
                  </Td>
                ))}
              </SkeletonRow>
            ))}
        </tbody>
      </Table>
    ) : (
      <GridContainer>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <GridItem key={index}>
              <SkeletonVisual />
              <div style={{ marginTop: '1rem' }}>
                <SkeletonCell />
              </div>
            </GridItem>
          ))}
      </GridContainer>
    )
  }

  function renderData() {
    return viewMode === 'table' ? (
      <Table>
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <Th
                key={column.key as string}
                onClick={() => onSort(column.key as keyof T)}
              >
                {column.label}
                {sortConfig.column === column.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow key={index} onClick={() => onRowClick?.(item)}>
              {visibleColumns.map((column) => (
                <Td
                  key={column.key as string}
                  data-label={column.label}
                  data-key={column.key}
                >
                  {renderCell(item, column.key as keyof T | string)}
                </Td>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    ) : (
      <GridContainer>
        {data.map((item, index) => (
          <GridItem key={index} onClick={() => onRowClick?.(item)}>
            <GridItemContent>
              {renderCell(item, 'visual')}
              {visibleColumns
                .filter((col) => col.key !== 'visual')
                .map((column) => (
                  <GridItemField key={column.key as string}>
                    <span>{column.label}:</span>
                    <span>
                      {renderCell(item, column.key as keyof T | string)}
                    </span>
                  </GridItemField>
                ))}
            </GridItemContent>
          </GridItem>
        ))}
      </GridContainer>
    )
  }

  function renderNoResults() {
    return (
      <NoResults>
        {noResultsMessage}
        {onResetFilters && (
          <>
            ,{' '}
            <ResetFilters onClick={onResetFilters}>reset filters?</ResetFilters>
          </>
        )}
      </NoResults>
    )
  }
}

const Container = styled.div`
  position: relative;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;

  @media (max-width: 768px) {
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
  display: flex;
  gap: 1rem;
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  &:focus {
    outline: none;
    border-color: #5a5a5a;
  }
`

const Table = styled.table.attrs({
  role: 'grid',
})`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tbody {
      display: block;
      width: 100%;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border-radius: 8px;
      padding: 0.75rem;
    }

    td {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      border: none;

      &:not(:last-child) {
        border-bottom: 1px solid #3a3a3a;
      }

      &:before {
        content: attr(data-label);
        color: #888;
        font-size: 0.9rem;
      }

      &[data-key='icon'],
      &[data-key='visual'] {
        align-items: center;
        padding: 1rem 0;

        &:before {
          display: none;
        }
      }

      &[data-key='visual'] {
        margin-bottom: 0.5rem;
      }
    }
  }
`

const Th = styled.th.attrs<{ onClick?: () => void }>((props) => ({
  tabIndex: 0,
  role: 'columnheader',
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      props.onClick?.()
    }
  },
}))<{ onClick?: () => void }>`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #2a2a2a;
  color: #888;
  font-weight: normal;
  cursor: pointer;
  user-select: none;

  &:hover,
  &:focus {
    outline: none;
    color: #fff;
  }
`

const Td = styled.td`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #2a2a2a;
  overflow: hidden;

  @media (max-width: 768px) {
    text-align: left;
    img,
    video {
      max-width: 100%;
      height: auto;
    }
  }
`

const TableRow = styled.tr.attrs<{ onClick?: () => void }>((props) => ({
  tabIndex: props.onClick ? 0 : undefined,
  role: 'row',
  onKeyDown: (e: React.KeyboardEvent) => {
    if (props.onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      props.onClick()
    }
  },
}))<{ onClick?: () => void }>`
  transition: background-color 0.2s ease;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover,
  &:focus,
  &:focus-within {
    background-color: #222222;
    outline: none;
  }

  &.selected {
    background-color: #222222;
  }

  @media (max-width: 768px) {
    transition: background-color 0.2s ease;

    &:hover,
    &:focus,
    &:focus-within {
      background-color: #202020;
    }
  }
`

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
`

const ResetFilters = styled.a`
  color: #9f9f9f;
  text-decoration: underline;
  cursor: pointer;
`

const SkeletonCell = styled(Skeleton).attrs({
  highlightColor: '#3a3a3a',
  baseColor: '#2a2a2a',
})`
  width: 100%;
  height: 20px;
  margin: 0;
`

const SkeletonVisual = styled(Skeleton).attrs({
  highlightColor: '#3a3a3a',
  baseColor: '#2a2a2a',
  width: 144,
  height: 144,
  borderRadius: 4,
})``

const SkeletonIcon = styled(Skeleton).attrs({
  highlightColor: '#3a3a3a',
  baseColor: '#2a2a2a',
  width: 32,
  height: 32,
  borderRadius: 4,
})``

const SkeletonDescription = styled(Skeleton).attrs({
  highlightColor: '#3a3a3a',
  baseColor: '#2a2a2a',
  height: 20,
})`
  min-width: 200px;
`

const SkeletonRow = styled(TableRow)`
  opacity: 0.5;
  pointer-events: none;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
`

const GridItem = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
  }
`

const GridItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const GridItemField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.9rem;

  span:first-child {
    color: #888;
  }

  span:last-child {
    color: #fff;
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
