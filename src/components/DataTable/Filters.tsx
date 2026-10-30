import { useTranslation } from '@/hooks/useTranslation'
import { useId } from 'react'
import styled from 'styled-components'
import { selectStyles } from '@/components/Select.styles'
import { FiltersProps } from './types'

export function Filters({
  filters,
  columnVisibility,
  onColumnVisibilityChange,
  formatColumnName,
  viewMode,
  onViewModeChange,
  allowGridView,
}: FiltersProps) {
  const { t } = useTranslation()
  const filterId = useId()

  return (
    <FiltersSection aria-label={t('filters.filters')}>
      <SelectFilters>
        {allowGridView && (
          <FilterGroup>
            <FilterLabel htmlFor={`${filterId}-view`}>
              {t('filters.view')}
            </FilterLabel>
            <FilterSelect
              id={`${filterId}-view`}
              value={viewMode}
              onChange={(event) => {
                onViewModeChange?.(
                  event.target.value === 'grid' ? 'grid' : 'table',
                )
              }}
            >
              <option value="table">{t('filters.viewModeTable')}</option>
              <option value="grid">{t('filters.viewModeGrid')}</option>
            </FilterSelect>
          </FilterGroup>
        )}

        {filters.map((filter) => (
          <FilterGroup key={filter.id}>
            <FilterLabel htmlFor={filter.id}>{filter.label}</FilterLabel>
            <FilterSelect
              id={filter.id}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        ))}
        <FilterGroup>
          <FilterLabel htmlFor={`${filterId}-columns`}>
            {t('filters.columns')}
          </FilterLabel>
          <FilterSelect
            id={`${filterId}-columns`}
            multiple
            size={1}
            value={Object.keys(columnVisibility).filter(
              (column) => columnVisibility[column],
            )}
            onChange={(event) => {
              const selected = new Set(
                Array.from(
                  event.currentTarget.selectedOptions,
                  (option) => option.value,
                ),
              )
              for (const [column, visible] of Object.entries(
                columnVisibility,
              )) {
                if (visible !== selected.has(column)) {
                  onColumnVisibilityChange(column, selected.has(column))
                }
              }
            }}
          >
            {Object.keys(columnVisibility).map((column) => (
              <option key={column} value={column}>
                {formatColumnName(column)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </SelectFilters>
    </FiltersSection>
  )
}

const FiltersSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const SelectFilters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  &:empty {
    display: none;
  }
`

const FilterGroup = styled.div`
  min-width: 0;
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.small};
`

const FilterSelect = styled.select`
  ${selectStyles}

  &[multiple] option {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`
