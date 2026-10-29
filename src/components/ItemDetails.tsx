'use client'

import {
  ArmorSets,
  SetVisualContainer,
  SetInfo,
  SetInfoItem,
  SetInfoLabel,
  SetInfoValue,
  HarborBirthdayItem,
  SetName,
} from '@/components/primitives/ItemDetailsLayout'

import { ChangedProperties, CollapsibleSection } from './DetailsSections'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Item } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  BackButton,
  Container,
  NotificationPanel,
  NotificationLink,
  DetailIcon,
  ContentWrapper,
  Description,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  Label,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
  ChangedTag,
} from '@/components/primitives/DetailsPrimitives'

interface ItemDetailsProps {
  item: Item
}

const BIRTHDAY_ITEM_ID_2026 = 5600

export const ItemDetails = ({ item }: ItemDetailsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})
  const [showChangedProperties, setShowChangedProperties] = useState(false)
  const formatColumnName = useFormatColumnName()

  const priorityPropertyOrder = [
    'crystal_type',
    ...(item.body_part?.some((part) => part.toLowerCase().includes('lhand')) &&
    item.shield_defense
      ? ['shield_defense']
      : []),
    'physical_damage',
    'magical_damage',
    'soulshot_count',
    'spiritshot_count',
    'attack_speed',
    'physical_defense',
    'magical_defense',
    'mp_consume',
    'mp_bonus',
    'base_price',
    'crystal_count',
    'weight',
    'weapon_type',
    'body_part',
    'armor_type',
  ]

  const isPriorityProperty = (key: string) => {
    return priorityPropertyOrder.includes(key.toLowerCase())
  }

  const isDropProperty = (key: string) => {
    return key.toLowerCase().includes('drop')
  }

  const isEffectProperty = (key: string) => {
    const lowerKey = key.toLowerCase()
    return (
      lowerKey.includes('consume_type') || lowerKey.includes('attack_effect')
    )
  }

  const isMeshTextureProperty = (key: string) => {
    const lowerKey = key.toLowerCase()
    return (
      (lowerKey.includes('mesh') ||
        lowerKey.includes('texture') ||
        lowerKey.includes('projectile')) &&
      !lowerKey.includes('drop')
    )
  }

  const isSoundProperty = (key: string) => {
    return key.toLowerCase().includes('sound')
  }

  const isHiddenProperty = (key: string) => {
    return (
      key.toLowerCase() === 'sets' ||
      key.toLowerCase() === 'is_new' ||
      key.toLowerCase() === 'is_changed' ||
      key.toLowerCase() === 'changes'
    )
  }

  const propertySections = [
    {
      id: 'drop',
      title: t('details.sections.dropProperties'),
      matches: isDropProperty,
    },
    {
      id: 'mesh',
      title: t('details.sections.meshTextureProperties'),
      matches: isMeshTextureProperty,
    },
    {
      id: 'sound',
      title: t('details.sections.soundProperties'),
      matches: isSoundProperty,
    },
    {
      id: 'effect',
      title: t('details.sections.otherProperties'),
      matches: isEffectProperty,
    },
  ].map((section) => ({
    ...section,
    entries: Object.entries(item).filter(([key]) => section.matches(key)),
  }))

  const hasChangedProperties =
    item.is_changed && item.changes && Object.keys(item.changes).length > 0

  return (
    <Container>
      <BackButton
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        ⟵
      </BackButton>
      {renderItemDetails()}
    </Container>
  )

  function renderItemDetails() {
    return (
      <ContentWrapper>
        <TableContainer>
          {(item.is_new || item.is_changed) && (
            <NotificationPanel $isNew={!!item.is_new}>
              {item.is_new ? (
                t('itemDetails.new')
              ) : hasChangedProperties ? (
                <NotificationLink
                  href="#changes-section"
                  onClick={() => {
                    setShowChangedProperties(true)
                  }}
                >
                  {t('itemDetails.changed')}
                </NotificationLink>
              ) : (
                t('itemDetails.changed')
              )}
            </NotificationPanel>
          )}
          <ItemHeader>
            <HeaderLeft>
              <DetailIcon
                icon={item.icon?.[0]}
                alt={item.name || item.object_name || ''}
                width={64}
                height={64}
              />
              <h1>{item.name || item.object_name}</h1>
            </HeaderLeft>
            <ExternalLinks data={item} />
          </ItemHeader>

          <Description>
            {item.description?.replace(/\\n/g, '\n') ||
              t('details.noDescription')}
            {item.object_id === BIRTHDAY_ITEM_ID_2026 && (
              <HarborBirthdayItem src="/icon/harborlove.webp" />
            )}
          </Description>

          <Stats>
            {priorityPropertyOrder.map((priorityKey) => {
              const actualKey = Object.keys(item).find(
                (key) => key.toLowerCase() === priorityKey,
              )

              if (!actualKey) return null
              const value = item[actualKey as keyof Item]

              return (
                <StatRow key={actualKey}>
                  <Label>{formatColumnName(actualKey)}:</Label>
                  <Value>
                    {actualKey.toLowerCase() === 'crystal_type'
                      ? String(value).toLowerCase() === 'none'
                        ? String(value)
                        : String(value).toUpperCase()
                      : Array.isArray(value)
                        ? value.join(', ')
                        : String(value)}
                  </Value>
                </StatRow>
              )
            })}

            {Object.entries(item).map(([key, value]) => {
              if (
                key === 'icon' ||
                key === 'name' ||
                key === 'description' ||
                isPriorityProperty(key) ||
                isDropProperty(key) ||
                isEffectProperty(key) ||
                isMeshTextureProperty(key) ||
                isSoundProperty(key) ||
                isHiddenProperty(key)
              )
                return null

              const isChanged =
                item.changes &&
                Object.keys(item.changes).some(
                  (changedKey) =>
                    changedKey.toLowerCase() === key.toLowerCase(),
                )

              return (
                <StatRow key={key}>
                  <Label>{formatColumnName(key)}:</Label>
                  <Value>
                    {Array.isArray(value)
                      ? value.join(', ')
                      : value?.toString()}
                    {isChanged && (
                      <ChangedTag> {t('details.propertyChanged')}</ChangedTag>
                    )}
                  </Value>
                </StatRow>
              )
            })}
          </Stats>

          {hasChangedProperties && (
            <ChangedProperties
              changes={item.changes || {}}
              open={showChangedProperties}
              onToggle={() => setShowChangedProperties(!showChangedProperties)}
            />
          )}

          {propertySections
            .filter((section) => section.entries.length > 0)
            .map((section) => (
              <CollapsibleSection
                key={section.id}
                title={section.title}
                open={expandedSections[section.id] ?? false}
                onToggle={() =>
                  setExpandedSections((previous) => ({
                    ...previous,
                    [section.id]: !previous[section.id],
                  }))
                }
              >
                {section.entries.map(([key, value]) => (
                  <StatRow key={key}>
                    <Label>{formatColumnName(key)}:</Label>
                    <Value>
                      {Array.isArray(value)
                        ? value.join(', ')
                        : value?.toString()}
                    </Value>
                  </StatRow>
                ))}
              </CollapsibleSection>
            ))}
        </TableContainer>

        {item.sets && item.sets.length > 0 && (
          <ArmorSets>
            <h2>{t('itemDetails.partOfSets')}</h2>
            {item.sets.map((armorSet) => (
              <div key={armorSet.id}>
                <Link
                  rel="canonical"
                  key={armorSet.id}
                  href={`/armorsets/${armorSet.id}`}
                >
                  <SetName>{armorSet.name}</SetName>
                </Link>
                <SetVisualContainer>
                  <ArmorSetVisual armorSet={armorSet} />
                </SetVisualContainer>
                <SetInfo>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.armorType')}:</SetInfoLabel>
                    <SetInfoValue>
                      {armorSet.armor_type ||
                        armorSet.items[0]?.armor_type ||
                        t('details.notApplicable')}
                    </SetInfoValue>
                  </SetInfoItem>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.basePrice')}:</SetInfoLabel>
                    <SetInfoValue>
                      {armorSet.items
                        .reduce((sum, item) => sum + (item.base_price || 0), 0)
                        .toLocaleString() || t('details.notApplicable')}
                    </SetInfoValue>
                  </SetInfoItem>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.pieces')}:</SetInfoLabel>
                    <SetInfoValue>{armorSet.items.length}</SetInfoValue>
                  </SetInfoItem>
                </SetInfo>
              </div>
            ))}
          </ArmorSets>
        )}
      </ContentWrapper>
    )
  }
}
