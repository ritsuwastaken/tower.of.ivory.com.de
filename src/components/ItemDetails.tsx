import {
  ChangedProperties,
  LoadingStats,
  CollapsibleSection,
} from './DetailsSections'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import { Head } from '@/components/Head'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { ArmorSet } from '@/types/armorset'
import { Item } from '@/types/item'
import { getDataUrl } from '@/utils/getDataUrl'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import {
  BackButton,
  Container,
  ContentWrapper,
  Description,
  ErrorText,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  Label,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from '@/components/primitives/DetailsPrimitives'
import { Skeleton } from './Skeleton'

interface ItemDetailsProps {
  id: number
}

const BIRTHDAY_ITEM_ID_2026 = 5600

const ItemDetailsLoading = () => {
  return (
    <ContentWrapper>
      <TableContainer>
        <ItemHeader>
          <HeaderLeft>
            <Skeleton borderRadius={8} width={64} height={64} />
            <h1>
              <Skeleton width={200} height={32} />
            </h1>
          </HeaderLeft>
          <HeaderRight>
            <Skeleton width={120} height={30} />
          </HeaderRight>
        </ItemHeader>

        <Description>
          <Skeleton count={3} />
        </Description>

        <LoadingStats />

        <MeshTextureSection>
          <Skeleton width={200} height={36} />
        </MeshTextureSection>

        <MeshTextureSection>
          <Skeleton width={200} height={36} />
        </MeshTextureSection>
      </TableContainer>

      <ArmorSets>
        <h2>
          <Skeleton width={150} />
        </h2>
        <SetCard>
          <h3 className="setName">
            <Skeleton width={180} />
          </h3>
          <SetVisualContainer>
            <Skeleton width={80} height={120} />
          </SetVisualContainer>
          <SetInfo>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <SetInfoItem key={index}>
                  <SetInfoLabel>
                    <Skeleton width={70} />
                  </SetInfoLabel>
                  <SetInfoValue>
                    <Skeleton width={50} />
                  </SetInfoValue>
                </SetInfoItem>
              ))}
          </SetInfo>
        </SetCard>
      </ArmorSets>
    </ContentWrapper>
  )
}

const ItemDetailsError = () => {
  const { t } = useTranslation()
  return (
    <ContentWrapper>
      <TableContainer>
        <ErrorText>{t('meta.itemNotFound')}</ErrorText>
      </TableContainer>
    </ContentWrapper>
  )
}

export const ItemDetails = ({ id }: ItemDetailsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})
  const [showChangedProperties, setShowChangedProperties] = useState(false)
  const formatColumnName = useFormatColumnName()

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery<Item, Error>({
    queryKey: ['item', id],
    queryFn: async () => {
      const [weaponsRes, armorRes, etcRes, setsRes] = await Promise.all([
        fetch(getDataUrl('/data/weapon.json')),
        fetch(getDataUrl('/data/armor.json')),
        fetch(getDataUrl('/data/etcitem.json')),
        fetch(getDataUrl('/data/armorsets.json')),
      ])

      if (!weaponsRes.ok || !armorRes.ok || !etcRes.ok || !setsRes.ok) {
        throw new Error('Failed to fetch item data')
      }

      const [weapons, armors, etcitems, armorsets] = await Promise.all([
        weaponsRes.json(),
        armorRes.json(),
        etcRes.json(),
        setsRes.json(),
      ])

      const allItems: Item[] = [...weapons, ...armors, ...etcitems]
      const found = allItems.find((i) => i.object_id === id)
      if (!found) {
        throw new Error('Item not found')
      }

      const sets = Array.isArray(armorsets)
        ? armorsets.filter(
            (set: ArmorSet) =>
              Array.isArray(set.items) &&
              set.items.some((setItem: Item) => setItem.object_id === id),
          )
        : []

      return { ...found, sets }
    },
  })

  const priorityPropertyOrder = [
    'crystal_type',
    ...(item?.body_part?.some((part) => part.toLowerCase().includes('lhand')) &&
    item?.shield_defense
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
    { id: 'drop', title: 'Drop Properties', matches: isDropProperty },
    {
      id: 'mesh',
      title: 'Mesh, Texture & Projectile Properties',
      matches: isMeshTextureProperty,
    },
    { id: 'sound', title: 'Sound Properties', matches: isSoundProperty },
    {
      id: 'effect',
      title: t('details.sections.otherProperties'),
      matches: isEffectProperty,
    },
  ].map((section) => ({
    ...section,
    entries: Object.entries(item || {}).filter(([key]) => section.matches(key)),
  }))

  const hasChangedProperties =
    item?.is_changed && item?.changes && Object.keys(item.changes).length > 0

  return (
    <Container>
      <Head
        description={
          isLoading
            ? t('meta.loading')
            : isError
              ? t('meta.itemNotFound')
              : item?.name
        }
      />
      <BackButton
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        ⟵
      </BackButton>
      {isLoading ? (
        <ItemDetailsLoading />
      ) : isError ? (
        <ItemDetailsError />
      ) : (
        renderItemDetails()
      )}
    </Container>
  )

  function renderItemDetails() {
    return (
      <ContentWrapper>
        <TableContainer>
          {(item?.is_new || item?.is_changed) && (
            <div
              className={`notificationPanel ${item?.is_new ? 'newItem' : 'changedItem'}`}
            >
              {item?.is_new ? (
                t('itemDetails.new')
              ) : hasChangedProperties ? (
                <Link
                  href="#changes-section"
                  className="notificationLink"
                  onClick={() => {
                    setShowChangedProperties(true)
                  }}
                >
                  {t('itemDetails.changed')}
                </Link>
              ) : (
                t('itemDetails.changed')
              )}
            </div>
          )}
          <ItemHeader>
            <HeaderLeft>
              <Image
                src={getDataUrl(
                  `/icon/${item?.icon?.[0].split('.').at(-1)}.webp`,
                )}
                alt={item?.name || item?.object_name || ''}
                width={64}
                height={64}
                className="icon"
              />
              <h1>{item?.name || item?.object_name}</h1>
            </HeaderLeft>
            {item && <ExternalLinks data={item} />}
          </ItemHeader>

          <Description>
            {item?.description?.replace(/\\n/g, '\n') ||
              t('details.noDescription')}
            {item?.object_id === BIRTHDAY_ITEM_ID_2026 && (
              <HarborBirthdayItem />
            )}
          </Description>

          <Stats>
            {priorityPropertyOrder.map((priorityKey) => {
              const actualKey = Object.keys(item || {}).find(
                (key) => key.toLowerCase() === priorityKey,
              )

              if (!actualKey) return null
              const value = item?.[actualKey as keyof Item]

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

            {Object.entries(item || {}).map(([key, value]) => {
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
                item?.changes &&
                Object.keys(item?.changes).some(
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
                      <span className="changedTag">
                        {' '}
                        {t('details.propertyChanged')}
                      </span>
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

        {item?.sets && item?.sets.length > 0 && (
          <ArmorSets>
            <h2>{t('itemDetails.partOfSets')}</h2>
            {item?.sets.map((armorSet) => (
              <div key={armorSet.id}>
                <Link
                  rel="canonical"
                  key={armorSet.id}
                  href={`/armorsets/${armorSet.id}`}
                >
                  <h3 className="setName">{armorSet.name}</h3>
                </Link>
                <SetVisualContainer>
                  <ArmorSetVisual armorSet={armorSet} />
                </SetVisualContainer>
                <SetInfo>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.armorType')}:</SetInfoLabel>
                    <SetInfoValue>
                      {armorSet.armor_type ||
                        armorSet.items?.[0]?.armor_type ||
                        t('details.notApplicable')}
                    </SetInfoValue>
                  </SetInfoItem>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.basePrice')}:</SetInfoLabel>
                    <SetInfoValue>
                      {armorSet.items
                        ?.reduce((sum, item) => sum + (item.base_price || 0), 0)
                        .toLocaleString() || t('details.notApplicable')}
                    </SetInfoValue>
                  </SetInfoItem>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.pieces')}:</SetInfoLabel>
                    <SetInfoValue>{armorSet.items?.length || 0}</SetInfoValue>
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

const ArmorSets = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    align-self: center;
  }

  h2 {
    margin-top: 0;
    font-size: 1.2rem;
    text-align: center;
  }

  .setName {
    margin-top: 0;
    font-size: 1rem;
    text-align: center;
    text-decoration: underline;
  }
`

const SetVisualContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`

const SetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
`

const SetInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const SetInfoLabel = styled.span`
  color: var(--text-color-secondary, #666);
  font-weight: 500;
`

const SetInfoValue = styled.span`
  color: var(--text-color, #333);
`

const SetCard = styled.div``

const HarborBirthdayItem = styled.img.attrs({
  src: getDataUrl('/icon/harborlove.webp'),
  alt: 'Harbor Birthday 1 year',
})`
  max-height: 256px;
  max-width: 256px;
  border-radius: 4px;
  margin-top: 8px;
`
