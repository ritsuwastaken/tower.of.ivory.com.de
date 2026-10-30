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
  const columnsId = `${filterId}-columns`
  const columnsLabelId = `${columnsId}-label`
  const popoverId = `${columnsId}-options`
  const anchorName = `--columns-${filterId.replace(/[^a-zA-Z0-9_-]/g, '')}`

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
          <FilterLabel id={columnsLabelId} htmlFor={columnsId}>
            {t('filters.columns')}
          </FilterLabel>
          <ColumnsButton
            id={columnsId}
            type="button"
            popoverTarget={popoverId}
            $anchorName={anchorName}
            aria-labelledby={`${columnsLabelId} ${columnsId}`}
          >
            {t('filters.columnsSelected', {
              count: Object.values(columnVisibility).filter(Boolean).length,
            })}
          </ColumnsButton>
          <ColumnOptions
            id={popoverId}
            popover="auto"
            $anchorName={anchorName}
            aria-labelledby={columnsLabelId}
            onToggle={(event) => {
              if (
                event.newState === 'closed' &&
                (document.activeElement === document.body ||
                  event.currentTarget.contains(document.activeElement))
              ) {
                document.getElementById(columnsId)?.focus()
              }
            }}
          >
            {Object.entries(columnVisibility).map(
              ([column, visible], index) => (
                <ColumnOption key={column}>
                  <input
                    type="checkbox"
                    autoFocus={index === 0}
                    checked={visible}
                    onChange={(event) =>
                      onColumnVisibilityChange(
                        column,
                        event.currentTarget.checked,
                      )
                    }
                  />
                  {formatColumnName(column)}
                </ColumnOption>
              ),
            )}
          </ColumnOptions>
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`

const ColumnsButton = styled.button<{ $anchorName: string }>`
  ${selectStyles}
  anchor-name: ${({ $anchorName }) => $anchorName};
  text-align: left;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`

const ColumnOptions = styled.fieldset<{ $anchorName: string }>`
  width: 18rem;
  max-width: calc(100vw - 2rem);
  max-height: min(24rem, 70dvh);
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.control};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body};

  @supports (position-anchor: auto) {
    position-anchor: ${({ $anchorName }) => $anchorName};
    inset: auto;
    top: anchor(bottom);
    left: anchor(left);
    margin: 0;
    margin-top: ${({ theme }) => theme.spacing.xs};
    position-try-fallbacks: flip-inline, flip-block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}),
    (pointer: coarse) {
    position: fixed;
    position-anchor: auto;
    position-try-fallbacks: none;
    inset: auto ${({ theme }) => theme.spacing.lg}
      max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-bottom))
      ${({ theme }) => theme.spacing.lg};
    width: auto;
    max-width: none;
    margin: 0;
  }
`

const ColumnOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: var(--control-height);
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.control};
  cursor: pointer;
  user-select: none;

  &:hover,
  &:focus-within {
    background: ${({ theme }) => theme.colors.hover};
  }
`
