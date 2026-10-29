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
  const popoverId = useId()

  return (
    <FiltersDropdown>
      <FiltersToggle popoverTarget={popoverId}>
        {t('filters.filters')}
      </FiltersToggle>

      <FiltersSection id={popoverId} popover="auto">
        {allowGridView && (
          <FilterGroup>
            <FilterLabel htmlFor={`${popoverId}-view`}>
              {t('filters.view')}:
            </FilterLabel>
            <FilterSelect
              id={`${popoverId}-view`}
              value={viewMode}
              onChange={(event) => {
                event.currentTarget
                  .closest<HTMLElement>('[popover]')
                  ?.hidePopover()
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

        {checkboxFilters.map((filter) => (
          <FilterGroup key={filter.id}>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={filter.checked}
                onChange={filter.onChange}
              />
              {filter.label}
            </CheckboxLabel>
          </FilterGroup>
        ))}

        <FilterGroup>
          <FilterLabel>{t('filters.columns')}:</FilterLabel>
          <ColumnToggles>
            {Object.entries(columnVisibility).map(([column, isVisible]) => (
              <CheckboxLabel key={column}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => onColumnVisibilityChange(column, !isVisible)}
                />
                {formatColumnName(column)}
              </CheckboxLabel>
            ))}
          </ColumnToggles>
        </FilterGroup>
      </FiltersSection>
    </FiltersDropdown>
  )
}

const FiltersDropdown = styled.div`
  position: static;
`

const FiltersToggle = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #3a3a3a;
  }

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }
`

const FiltersSection = styled.div`
  position: fixed;
  inset: 0;
  width: calc(100% - 2rem);
  height: fit-content;
  margin: auto;
  color: inherit;
  background-color: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  padding: 1rem;
  animation: slideDown 0.2s ease;
  max-height: min(80dvh, calc(100dvh - 2rem));
  overflow-y: auto;
  overscroll-behavior: contain;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @supports (position-area: bottom center) and (anchor-scope: --table-filters) {
    @media (min-width: 891px) and (hover: hover) {
      position-anchor: --table-filters;
      position-area: bottom center;
      inset: auto;
      width: 100%;
      margin: 0.5rem 0 0;
      max-height: min(80vh, calc(100% - 1rem));
    }
  }
`

const FilterGroup = styled.div`
  margin-bottom: 1rem;
  padding: 0.25rem 0;
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
`

const FilterSelect = styled.select`
  ${selectStyles}
  &:focus {
    outline: none;
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
