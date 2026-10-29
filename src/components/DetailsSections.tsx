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
} from './primitives/DetailsPrimitives'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  id?: string
  open: boolean
  onToggle: () => void
}

export function CollapsibleSection({
  title,
  children,
  id,
  open,
  onToggle,
}: CollapsibleSectionProps) {
  return (
    <ViewTransition>
      <MeshTextureSection id={id}>
        <CollapseButton
          onClick={() => startTransition(onToggle)}
          aria-expanded={open}
        >
          {open ? '−' : '+'} {title}
        </CollapseButton>
        {open && <MeshTextureContent>{children}</MeshTextureContent>}
      </MeshTextureSection>
    </ViewTransition>
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
    <CollapsibleSection
      id="changes-section"
      title={t('details.sections.changedProperties')}
      open={open}
      onToggle={onToggle}
    >
      {Object.entries(changes).map(
        ([key, { old: oldValue, new: newValue }]) => {
          const isNumeric = !isNaN(Number(oldValue)) && !isNaN(Number(newValue))
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
    </CollapsibleSection>
  )
}
