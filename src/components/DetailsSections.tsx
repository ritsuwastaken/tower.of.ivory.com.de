import { formatPropertyValue } from '@/utils/formatPropertyValue'
import { type ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@/hooks/useTranslation'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import {
  Label,
  CollapseButton,
  ChangeArrow,
  MeshTextureContent,
  MeshTextureSection,
  StatRow,
  Value,
} from './Details.styles'

export function CollapsibleSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <MeshTextureSection as="details" suppressHydrationWarning>
      <CollapseButton as="summary">{title}</CollapseButton>
      <MeshTextureContent>{children}</MeshTextureContent>
    </MeshTextureSection>
  )
}

export function ChangedProperties({
  changes,
  autoOpen = false,
}: {
  changes: Record<string, { old: unknown; new: unknown }>
  autoOpen?: boolean
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (autoOpen || window.location.hash === '#changes-section') {
      const details = detailsRef.current
      if (details) {
        details.open = true
        details.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [autoOpen, changes])
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()
  return (
    <ChangesSection
      id="changes-section"
      ref={detailsRef}
      suppressHydrationWarning
    >
      <CollapseButton as="summary">
        {t('details.sections.changedProperties')}
      </CollapseButton>
      <MeshTextureContent>
        {Object.entries(changes).map(
          ([key, { old: oldValue, new: newValue }]) => {
            const isNumeric =
              !isNaN(Number(oldValue)) && !isNaN(Number(newValue))
            return (
              <StatRow key={key}>
                <Label>{formatColumnName(key)}:</Label>
                <Value>
                  {isNumeric ? (
                    <>
                      {formatPropertyValue(oldValue)}{' '}
                      <ChangeArrow
                        $increased={Number(newValue) > Number(oldValue)}
                      >
                        →
                      </ChangeArrow>{' '}
                      {formatPropertyValue(newValue)}
                    </>
                  ) : !oldValue ? (
                    '-'
                  ) : (
                    formatPropertyValue(oldValue)
                  )}
                </Value>
              </StatRow>
            )
          },
        )}
      </MeshTextureContent>
    </ChangesSection>
  )
}

export function openChangedProperties() {
  const details = document.getElementById('changes-section')
  if (details instanceof HTMLDetailsElement) details.open = true
}

const ChangesSection = styled.details`
  padding-top: 5px;
`
