import { type ReactNode, startTransition, ViewTransition } from 'react'
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
  open,
  onToggle,
}: {
  changes: Record<string, { old: unknown; new: unknown }>
  open: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()
  return (
    <ViewTransition>
      <MeshTextureSection id="changes-section">
        <CollapseButton
          onClick={() => startTransition(onToggle)}
          aria-expanded={open}
        >
          {open ? '−' : '+'} {t('details.sections.changedProperties')}
        </CollapseButton>
        {open && (
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
                          {oldValue?.toString()}{' '}
                          <ChangeArrow
                            $increased={Number(newValue) > Number(oldValue)}
                          >
                            →
                          </ChangeArrow>{' '}
                          {newValue?.toString()}
                        </>
                      ) : !oldValue ? (
                        '-'
                      ) : Array.isArray(oldValue) ? (
                        oldValue.join(', ')
                      ) : (
                        oldValue.toString()
                      )}
                    </Value>
                  </StatRow>
                )
              },
            )}
          </MeshTextureContent>
        )}
      </MeshTextureSection>
    </ViewTransition>
  )
}
