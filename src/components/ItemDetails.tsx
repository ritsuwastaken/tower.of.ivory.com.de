import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import { Head } from '@/components/Head'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { ArmorSet } from '@/types/armorset'
import { Item } from '@/types/item'
import { getDataUrl } from '@/utils/dataUrl'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import {
  BackButton,
  Container,
  Description,
  ErrorText,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  Label,
  MeshTextureContent,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from '@/components/primitives/DetailsPrimitives'

interface ItemDetailsProps {
  id: number
}

const ItemDetailsLoading = () => {
  return (
    <ContentWrapper>
      <TableContainer>
        <ItemHeader>
          <HeaderLeft>
            <Skeleton
              borderRadius={8}
              width={64}
              height={64}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
            <h1>
              <Skeleton
                width={200}
                height={32}
                baseColor="#2a2a2a"
                highlightColor="#3a3a3a"
              />
            </h1>
          </HeaderLeft>
          <HeaderRight>
            <Skeleton
              width={120}
              height={30}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </HeaderRight>
        </ItemHeader>

        <Description>
          <Skeleton count={3} baseColor="#2a2a2a" highlightColor="#3a3a3a" />
        </Description>

        <Stats>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <StatRow key={index}>
                <Label>
                  <Skeleton
                    width={100}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </Label>
                <Value>
                  <Skeleton
                    width={80}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </Value>
              </StatRow>
            ))}
        </Stats>

        <MeshTextureSection>
          <Skeleton
            width={200}
            height={36}
            baseColor="#2a2a2a"
            highlightColor="#3a3a3a"
          />
        </MeshTextureSection>

        <MeshTextureSection>
          <Skeleton
            width={200}
            height={36}
            baseColor="#2a2a2a"
            highlightColor="#3a3a3a"
          />
        </MeshTextureSection>
      </TableContainer>

      <ArmorSets>
        <h2>
          <Skeleton width={150} baseColor="#2a2a2a" highlightColor="#3a3a3a" />
        </h2>
        <SetCard>
          <h3 className="setName">
            <Skeleton
              width={180}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </h3>
          <SetVisualContainer>
            <Skeleton
              width={80}
              height={120}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </SetVisualContainer>
          <SetInfo>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <SetInfoItem key={index}>
                  <SetInfoLabel>
                    <Skeleton
                      width={70}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </SetInfoLabel>
                  <SetInfoValue>
                    <Skeleton
                      width={50}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
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
  return (
    <ContentWrapper>
      <TableContainer>
        <ErrorText>Item not found</ErrorText>
      </TableContainer>
    </ContentWrapper>
  )
}

export const ItemDetails = ({ id }: ItemDetailsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showMeshTexture, setShowMeshTexture] = useState(false)
  const [showSound, setShowSound] = useState(false)
  const [showDropProperties, setShowDropProperties] = useState(false)
  const [showEffectProperties, setShowEffectProperties] = useState(false)
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

  const hasDropProperties = Object.keys(item || {}).some((key) =>
    isDropProperty(key),
  )
  const hasMeshTextureProperties = Object.keys(item || {}).some((key) =>
    isMeshTextureProperty(key),
  )
  const hasSoundProperties = Object.keys(item || {}).some((key) =>
    isSoundProperty(key),
  )
  const hasEffectProperties = Object.keys(item || {}).some((key) =>
    isEffectProperty(key),
  )
  const hasChangedProperties =
    item?.is_changed && item?.changes && Object.keys(item.changes).length > 0

  return (
    <Container>
      <Head
        description={
          isLoading ? 'Loading...' : isError ? 'Item Not found' : item?.name
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
              'No description available.'}
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
                    {isChanged && <span className="changedTag">(changed)</span>}
                  </Value>
                </StatRow>
              )
            })}
          </Stats>

          {hasChangedProperties && (
            <MeshTextureSection id="changes-section">
              <button
                className="collapseButton"
                onClick={() => setShowChangedProperties(!showChangedProperties)}
              >
                {showChangedProperties ? '−' : '+'} Changed Properties
              </button>

              {showChangedProperties && (
                <MeshTextureContent>
                  {Object.entries(item.changes || {}).map(
                    ([key, { old: oldValue, new: newValue }]) => {
                      const isNumeric =
                        !isNaN(Number(oldValue)) && !isNaN(Number(newValue))

                      return (
                        <StatRow key={key}>
                          <Label>{formatColumnName(key)}:</Label>
                          <Value>
                            {isNumeric ? (
                              <>
                                {oldValue?.toString()}
                                {Number(newValue) > Number(oldValue) ? (
                                  <>
                                    {' '}
                                    <span className="increased">→</span>{' '}
                                    {newValue?.toString()}
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <span className="decreased">→</span>{' '}
                                    {newValue?.toString()}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {!oldValue
                                  ? '-'
                                  : Array.isArray(oldValue)
                                    ? oldValue.join(', ')
                                    : oldValue?.toString()}
                              </>
                            )}
                          </Value>
                        </StatRow>
                      )
                    },
                  )}
                </MeshTextureContent>
              )}
            </MeshTextureSection>
          )}

          {hasDropProperties && (
            <MeshTextureSection>
              <button
                className="collapseButton"
                onClick={() => setShowDropProperties(!showDropProperties)}
              >
                {showDropProperties ? '−' : '+'} Drop Properties
              </button>

              {showDropProperties && (
                <MeshTextureContent>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isDropProperty(key)) return null

                    return (
                      <StatRow key={key}>
                        <Label>{formatColumnName(key)}:</Label>
                        <Value>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </Value>
                      </StatRow>
                    )
                  })}
                </MeshTextureContent>
              )}
            </MeshTextureSection>
          )}

          {hasMeshTextureProperties && (
            <MeshTextureSection>
              <button
                className="collapseButton"
                onClick={() => setShowMeshTexture(!showMeshTexture)}
              >
                {showMeshTexture ? '−' : '+'} Mesh, Texture & Projectile
                Properties
              </button>

              {showMeshTexture && (
                <MeshTextureContent>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isMeshTextureProperty(key)) return null

                    return (
                      <StatRow key={key}>
                        <Label>{formatColumnName(key)}:</Label>
                        <Value>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </Value>
                      </StatRow>
                    )
                  })}
                </MeshTextureContent>
              )}
            </MeshTextureSection>
          )}

          {hasSoundProperties && (
            <MeshTextureSection>
              <button
                className="collapseButton"
                onClick={() => setShowSound(!showSound)}
              >
                {showSound ? '−' : '+'} Sound Properties
              </button>

              {showSound && (
                <MeshTextureContent>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isSoundProperty(key)) return null

                    return (
                      <StatRow key={key}>
                        <Label>{formatColumnName(key)}:</Label>
                        <Value>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </Value>
                      </StatRow>
                    )
                  })}
                </MeshTextureContent>
              )}
            </MeshTextureSection>
          )}

          {hasEffectProperties && (
            <MeshTextureSection>
              <button
                className="collapseButton"
                onClick={() => setShowEffectProperties(!showEffectProperties)}
              >
                {showEffectProperties ? '−' : '+'} Other Properties
              </button>

              {showEffectProperties && (
                <MeshTextureContent>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isEffectProperty(key)) return null

                    return (
                      <StatRow key={key}>
                        <Label>{formatColumnName(key)}:</Label>
                        <Value>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </Value>
                      </StatRow>
                    )
                  })}
                </MeshTextureContent>
              )}
            </MeshTextureSection>
          )}
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
                        'N/A'}
                    </SetInfoValue>
                  </SetInfoItem>
                  <SetInfoItem>
                    <SetInfoLabel>{t('itemDetails.basePrice')}:</SetInfoLabel>
                    <SetInfoValue>
                      {armorSet.items
                        ?.reduce((sum, item) => sum + (item.base_price || 0), 0)
                        .toLocaleString() || 'N/A'}
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

const ContentWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

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
    border-bottom: 1px solid var(--border-color);
    font-size: 1.2rem;
    text-align: center;
  }

  .setName {
    margin-top: 0;
    font-size: 1rem;
    color: var(--primary-color);
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
