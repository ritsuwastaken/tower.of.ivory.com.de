'use client'

import { formatPropertyValue } from '@/utils/formatPropertyValue'
import {
  ArmorSets,
  SetVisualContainer,
  SetInfo,
  SetInfoItem,
  SetInfoLabel,
  SetInfoValue,
  HarborBirthdayItem,
  SetName,
} from '@/components/ItemDetails.styles'

import { ChangedProperties, CollapsibleSection } from './DetailsSections'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Item } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { groupItemProperties } from '@/utils/groupItemProperties'
import {
  BackButton,
  NotificationPanel,
  NotificationLink,
  DetailIcon,
  ContentWrapper,
  Description,
  HeaderLeft,
  ItemHeader,
  Label,
  StatRow,
  Stats,
  TableContainer,
  Value,
  ChangedTag,
} from '@/components/Details.styles'

interface ItemDetailsProps {
  item: Item
}

const BIRTHDAY_ITEM_ID_2026 = 5600

export const ItemDetails = ({ item }: ItemDetailsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showChangedProperties, setShowChangedProperties] = useState(false)
  const formatColumnName = useFormatColumnName()

  const { priority, other, sections } = groupItemProperties(item)
  const changedKeys = new Set(
    Object.keys(item.changes || {}).map((key) => key.toLowerCase()),
  )

  const hasChangedProperties =
    item.is_changed && item.changes && Object.keys(item.changes).length > 0

  return (
    <div>
      <BackButton
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        ⟵
      </BackButton>
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
            {priority.map(({ key, value, normalizedKey }) => (
              <StatRow key={key}>
                <Label>{formatColumnName(key)}:</Label>
                <Value>
                  {normalizedKey === 'crystal_type'
                    ? formatPropertyValue(value).toLowerCase() === 'none'
                      ? formatPropertyValue(value)
                      : formatPropertyValue(value).toUpperCase()
                    : formatPropertyValue(value)}
                </Value>
              </StatRow>
            ))}

            {other.map(({ key, value, normalizedKey }) => (
              <StatRow key={key}>
                <Label>{formatColumnName(key)}:</Label>
                <Value>
                  {formatPropertyValue(value)}
                  {changedKeys.has(normalizedKey) && (
                    <ChangedTag> {t('details.propertyChanged')}</ChangedTag>
                  )}
                </Value>
              </StatRow>
            ))}
          </Stats>

          {hasChangedProperties && (
            <ChangedProperties
              changes={item.changes || {}}
              open={showChangedProperties}
              onToggle={() => setShowChangedProperties(!showChangedProperties)}
            />
          )}

          {sections.map((section) => (
            <CollapsibleSection
              key={section.id}
              title={t(`details.sections.${section.id}`)}
            >
              {section.entries.map(({ key, value }) => (
                <StatRow key={key}>
                  <Label>{formatColumnName(key)}:</Label>
                  <Value>{formatPropertyValue(value)}</Value>
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
                <Link href={`/armorsets/${armorSet.id}`}>
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
    </div>
  )
}
