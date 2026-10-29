import { useTranslation } from '@/hooks/useTranslation'
import { useId } from 'react'
import styled from 'styled-components'
import { selectStyles } from '@/components/Select.styles'
import { FiltersProps } from './types'

export function Filters({
  filters,
  checkboxFilters,
  columnVisibility,
  onColumnVisibilityChange,
  formatColumnName,
  viewMode,
  onViewModeChange,
  allowGridView,
}: FiltersProps) {
  const { t } = useTranslation()
  const filterId = useId()
  const columnToggles = (
    <ColumnToggles>
      {Object.entries(columnVisibility).map(([column, isVisible]) => (
        <CheckboxLabel key={column}>
          <input
            type="checkbox"
            tabIndex={0}
            checked={isVisible}
            onChange={() => onColumnVisibilityChange(column, !isVisible)}
          />
          {formatColumnName(column)}
        </CheckboxLabel>
      ))}
    </ColumnToggles>
  )

  return (
    <FiltersSection aria-label={t('filters.filters')}>
      <SelectFilters>
        {allowGridView && (
          <FilterGroup>
            <FilterLabel htmlFor={`${filterId}-view`}>
              {t('filters.view')}:
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
      </SelectFilters>

      <CheckboxFilters>
        {checkboxFilters.map((filter) => (
          <CheckboxLabel key={filter.id}>
            <input
              type="checkbox"
              tabIndex={0}
              checked={filter.checked}
              onChange={filter.onChange}
            />
            {filter.label}
          </CheckboxLabel>
        ))}
      </CheckboxFilters>

      <ColumnSettings>
        <DesktopColumns role="group" aria-label={t('filters.columns')}>
          {columnToggles}
        </DesktopColumns>
        <MobileColumns suppressHydrationWarning>
          <summary tabIndex={0}>{t('filters.columns')}</summary>
          {columnToggles}
        </MobileColumns>
      </ColumnSettings>
    </FiltersSection>
  )
}

const FiltersSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SelectFilters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: 1rem;

  &:empty {
    display: none;
  }
`

const FilterGroup = styled.div`
  min-width: 0;
`

const CheckboxFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;

  &:empty {
    display: none;
  }
`

const ColumnSettings = styled.div`
  border-top: 1px solid #3a3a3a;
  padding-top: 0.75rem;
  color: #aaa;
`

const DesktopColumns = styled.div`
  @media (max-width: 890px) {
    display: none;
  }
`

const MobileColumns = styled.details`
  display: none;

  @media (max-width: 890px) {
    display: block;
  }

  summary {
    width: fit-content;
    color: #aaa;
    cursor: pointer;
  }

  &[open] summary {
    margin-bottom: 0.75rem;
  }
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
`

const FilterSelect = styled.select`
  ${selectStyles}
  &:focus {
    border-color: #5a5a5a;
  }
`

const ColumnToggles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;

  input {
    cursor: pointer;
    margin: 0;
    flex-shrink: 0;
  }

  &:hover {
    color: #fff;
  }
`
