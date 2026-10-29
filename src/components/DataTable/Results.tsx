import type { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
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

const Table = styled.table.attrs({
  role: 'grid',
})`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  @media (max-width: 890px) {
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
  onKeyDown: (e: KeyboardEvent) => {
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

const ResetFilters = styled.a`
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
  color: #888;
  font-size: 0.9rem;

  span:first-child {
    color: #888;
  }

  span:last-child {
    color: #fff;
  }
`
