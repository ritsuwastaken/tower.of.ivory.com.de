import { useTranslation } from '@/hooks/useTranslation'
import { useId } from 'react'
import styled from 'styled-components'
import { selectStyles } from '@/components/Select.styles'
import { FiltersProps } from './types'

export function Filters({
  filters,
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
      </SelectFilters>
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
