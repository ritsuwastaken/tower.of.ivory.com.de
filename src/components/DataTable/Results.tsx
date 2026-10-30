import type { KeyboardEvent } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import type { DataTableProps } from './types'

type ResultsProps<T> = Pick<
  DataTableProps<T>,
  | 'data'
  | 'columns'
  | 'onSort'
  | 'sortConfig'
  | 'onRowClick'
  | 'renderCell'
  | 'noResultsMessage'
  | 'onResetFilters'
> & { viewMode: 'table' | 'grid' }

export function TableResults<T>({
  data,
  columns,
  onSort,
  sortConfig,
  onRowClick,
  renderCell,
  noResultsMessage,
  onResetFilters,
  viewMode,
}: ResultsProps<T>) {
  const { t } = useTranslation()
  const visibleColumns = columns.filter((column) => column.visible)

  function renderData() {
    return viewMode === 'table' ? (
      <Table
        onMouseDown={(event) => {
          if (
            event.detail > 1 &&
            event.target instanceof HTMLElement &&
            event.target.matches('td, th, tr, table')
          ) {
            event.preventDefault()
          }
        }}
      >
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <Th
                key={column.key as string}
                aria-sort={
                  sortConfig.column === column.key
                    ? sortConfig.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {column.label && (
                  <SortButton
                    type="button"
                    onClick={() => onSort(column.key as keyof T)}
                  >
                    {column.label}
                    {sortConfig.column === column.key && (
                      <span aria-hidden="true">
                        {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </SortButton>
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

  function renderNoResults(message: string) {
    return (
      <NoResults>
        {message}
        {onResetFilters && (
          <>
            ,{' '}
            <ResetFilters onClick={onResetFilters}>
              {t('dataTable.resetFilters')}
            </ResetFilters>
          </>
        )}
      </NoResults>
    )
  }
  return data.length > 0
    ? renderData()
    : renderNoResults(noResultsMessage ?? t('dataTable.noResults'))
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.table}) {
    thead {
      display: none;
    }

    tbody {
      display: block;
      width: 100%;
    }

    tr {
      display: block;
      margin-bottom: ${({ theme }) => theme.spacing.lg};
      border-radius: ${({ theme }) => theme.radii.panel};
      padding: ${({ theme }) => theme.spacing.md};
    }

    td {
      display: flex;
      flex-direction: column;
      gap: ${({ theme }) => theme.spacing.xs};
      padding: ${({ theme }) => theme.spacing.sm};
      border: none;

      &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      }

      &:before {
        content: attr(data-label);
        color: ${({ theme }) => theme.colors.muted};
        font-size: ${({ theme }) => theme.typography.small};
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
        margin-bottom: ${({ theme }) => theme.spacing.sm};
      }
    }
  }
`

const Th = styled.th`
  padding: 0;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.control};
  color: ${({ theme }) => theme.colors.muted};
  font-weight: normal;
`

const SortButton = styled.button`
  min-height: var(--control-height);
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
  user-select: none;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.control};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.table}) {
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
  onKeyDown: (e: KeyboardEvent) => {
    if (
      e.target === e.currentTarget &&
      props.onClick &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
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
    background-color: ${({ theme }) => theme.colors.rowHover};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.table}) {
    transition: background-color 0.2s ease;

    &:hover,
    &:focus,
    &:focus-within {
      background-color: ${({ theme }) => theme.colors.mobileRowHover};
    }
  }
`

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const ResetFilters = styled.button`
  min-height: var(--control-height);
  background: none;
  border: none;
  font: inherit;
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  cursor: pointer;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: 1rem 0;
`

const GridItem = styled.div`
  background-color: ${({ theme }) => theme.colors.control};
  border-radius: ${({ theme }) => theme.radii.panel};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`

const GridItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const GridItemField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.small};
  min-width: 0;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.breakpoints.table}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }

  span:first-child {
    color: ${({ theme }) => theme.colors.secondary};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.text};
  }
`
