import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { useRef } from 'react'
import styled from 'styled-components'
import { FiltersProps } from './types'

export function Filters({
  isLoading,
  showFilters,
  setShowFilters,
  filters,
  checkboxFilters,
  columnVisibility,
  onColumnVisibilityChange,
  formatColumnName,
  viewMode,
  onViewModeChange,
  allowGridView,
}: FiltersProps) {
  const toggleRef = useRef<HTMLButtonElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(filtersRef, (e) => {
    const toggleClicked =
      toggleRef.current && toggleRef.current.contains(e.target as Node)
    return !toggleClicked && setShowFilters(false)
  })

  return (
    <FiltersDropdown>
      <FiltersToggle
        ref={toggleRef}
        onClick={() => setShowFilters(!showFilters)}
        disabled={isLoading}
      >
        Filters
      </FiltersToggle>

      {showFilters && !isLoading && (
        <FiltersSection ref={filtersRef}>
          {allowGridView && (
            <FilterGroup>
              <FilterLabel>View:</FilterLabel>
              <ViewToggle
                onClick={() =>
                  onViewModeChange?.(viewMode === 'table' ? 'grid' : 'table')
                }
                disabled={isLoading}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {viewMode === 'table' ? 'Grid View' : 'Table View'}
              </ViewToggle>
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
            <FilterLabel>Columns:</FilterLabel>
            <ColumnToggles>
              {Object.entries(columnVisibility).map(([column, isVisible]) => (
                <CheckboxLabel key={column}>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() =>
                      onColumnVisibilityChange(column, !isVisible)
                    }
                  />
                  {formatColumnName(column)}
                </CheckboxLabel>
              ))}
            </ColumnToggles>
          </FilterGroup>
        </FiltersSection>
      )}
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
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  padding: 1rem;
  z-index: 100;
  animation: slideDown 0.2s ease;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
`

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
`

const FilterSelect = styled.select`
  appearance: none;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2rem;

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
`

const ViewToggle = styled.button`
  padding: 0.5rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #3a3a3a;
  }

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }
`
