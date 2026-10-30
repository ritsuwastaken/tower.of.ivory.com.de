import type { KeyboardEvent, ReactNode } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import { DataTableProps } from './types'

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
> & { viewMode: 'table' | 'grid'; columnSettings: ReactNode }

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
  columnSettings,
}: ResultsProps<T>) {
  const { t } = useTranslation()
  const visibleColumns = columns.filter((column) => column.visible)

  function renderData() {
    return viewMode === 'table' ? (
      <Table>
        <thead>
          <tr>
            {(visibleColumns.length
              ? visibleColumns
              : [{ key: 'settings', label: '', visible: true }]
            ).map((column, index) => (
              <Th
                key={column.key as string}
                data-column-settings={index === 0 || undefined}
                aria-sort={
                  sortConfig.column === column.key
                    ? sortConfig.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
                onClick={
                  column.label ? () => onSort(column.key as keyof T) : undefined
                }
              >
                {index === 0 && columnSettings}
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
      <>
        {columnSettings}
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
      </>
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
  return data.length > 0 ? (
    renderData()
  ) : (
    <>
      {columnSettings}
      {renderNoResults(noResultsMessage ?? t('dataTable.noResults'))}
    </>
  )
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  @media (max-width: 890px) {
    thead {
      display: block;
    }

    th {
      display: none;
    }

    th[data-column-settings] {
      display: block;
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
  tabIndex: props.onClick ? 0 : undefined,
  role: 'columnheader',
  onKeyDown: (e: KeyboardEvent) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
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
    color: #fff;
  }
`

const Td = styled.td`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #2a2a2a;
  overflow: hidden;

  @media (max-width: 890px) {
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
    background-color: #222222;
  }

  @media (max-width: 890px) {
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

const ResetFilters = styled.button`
  background: none;
  border: none;
  font: inherit;
  color: #9f9f9f;
  text-decoration: underline;
  cursor: pointer;
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
  color: #aaa;
  font-size: 0.9rem;

  span:first-child {
    color: #aaa;
  }

  span:last-child {
    color: #fff;
  }
`
