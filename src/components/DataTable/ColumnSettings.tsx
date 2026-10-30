import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import { useId } from 'react'
import type { ColumnSettingsProps } from './types'

export function ColumnSettings({
  columnVisibility,
  onColumnVisibilityChange,
  formatColumnName,
}: ColumnSettingsProps) {
  const { t } = useTranslation()
  const popoverId = useId()
  const anchorName = `--columns-${popoverId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <Container onClick={(event) => event.stopPropagation()}>
      <SettingsButton
        type="button"
        popoverTarget={popoverId}
        $anchorName={anchorName}
        aria-label={t('filters.columns')}
        title={t('filters.columns')}
      >
        <span aria-hidden="true">⚙</span>
        <MobileLabel>{t('filters.columns')}</MobileLabel>
      </SettingsButton>
      <ColumnToggles
        id={popoverId}
        popover="auto"
        $anchorName={anchorName}
        role="group"
        aria-label={t('filters.columns')}
      >
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
    </Container>
  )
}

const Container = styled.span`
  display: inline-block;
  vertical-align: middle;
  text-align: left;
`

const SettingsButton = styled.button<{ $anchorName: string }>`
  anchor-name: ${({ $anchorName }) => $anchorName};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border: none;
  background: none;
  color: #aaa;
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  line-height: 1;

  @media (max-width: 890px) {
    min-height: 44px;
    padding: 0.5rem;
  }

  &:hover,
  &:focus-visible {
    color: #fff;
  }
`

const MobileLabel = styled.span`
  display: none;

  @media (max-width: 890px) {
    display: inline;
    font-size: 0.9rem;
  }
`

const ColumnToggles = styled.div<{ $anchorName: string }>`
  &:popover-open {
    display: grid;
  }

  @supports (position-anchor: auto) {
    position-anchor: ${({ $anchorName }) => $anchorName};
    inset: auto;
    top: anchor(bottom);
    left: anchor(left);
    margin: 0;
    position-try-fallbacks: flip-inline, flip-block;

    @media (max-width: 890px) {
      left: auto;
      right: anchor(right);
    }
  }

  gap: 0.75rem;
  width: max-content;
  max-width: min(20rem, 70vw);
  max-height: 60vh;
  overflow: auto;
  padding: 1rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background: #222;
  box-shadow: 0 4px 12px #0008;
  font-size: 0.9rem;
  font-weight: normal;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;

  @media (max-width: 890px) {
    min-height: 44px;
  }

  input {
    cursor: pointer;
    margin: 0;
    flex-shrink: 0;
  }

  &:hover {
    color: #fff;
  }
`
