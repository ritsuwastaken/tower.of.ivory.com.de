import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import { Head } from '@/components/Head'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { ArmorSet } from '@/types/armorset'
import { Item } from '@/types/item'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styles from './ItemDetails.module.css'

interface ItemDetailsProps {
  id: number
}

const ItemDetailsLoading = () => {
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.tableContainer}>
        <div className={styles.itemHeader}>
          <div className={styles.headerLeft}>
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
          </div>
          <div className={styles.headerRight}>
            <Skeleton
              width={120}
              height={30}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </div>
        </div>

        <div className={styles.description}>
          <Skeleton count={3} baseColor="#2a2a2a" highlightColor="#3a3a3a" />
        </div>

        <div className={styles.stats}>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.statRow}>
                <span className={styles.label}>
                  <Skeleton
                    width={100}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </span>
                <span className={styles.value}>
                  <Skeleton
                    width={80}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </span>
              </div>
            ))}
        </div>

        <div className={styles.meshTextureSection}>
          <Skeleton
            width={200}
            height={36}
            baseColor="#2a2a2a"
            highlightColor="#3a3a3a"
          />
        </div>

        <div className={styles.meshTextureSection}>
          <Skeleton
            width={200}
            height={36}
            baseColor="#2a2a2a"
            highlightColor="#3a3a3a"
          />
        </div>
      </div>

      <div className={styles.armorSets}>
        <h2>
          <Skeleton width={150} baseColor="#2a2a2a" highlightColor="#3a3a3a" />
        </h2>
        <div className={styles.setCard}>
          <h3 className={styles.setName}>
            <Skeleton
              width={180}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </h3>
          <div className={styles.setVisualContainer}>
            <Skeleton
              width={80}
              height={120}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </div>
          <div className={styles.setInfo}>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={styles.setInfoItem}>
                  <span className={styles.setInfoLabel}>
                    <Skeleton
                      width={70}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </span>
                  <span className={styles.setInfoValue}>
                    <Skeleton
                      width={50}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const ItemDetailsError = () => {
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.tableContainer}>
        <div className={styles.error}>Item not found</div>
      </div>
    </div>
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
        fetch('/data/weapon.json'),
        fetch('/data/armor.json'),
        fetch('/data/etcitem.json'),
        fetch('/data/armorsets.json'),
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
    <div className={styles.container}>
      <Head
        description={
          isLoading ? 'Loading...' : isError ? 'Item Not found' : item?.name
        }
      />
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
        className={styles.backButton}
      >
        ⟵
      </a>
      {isLoading ? (
        <ItemDetailsLoading />
      ) : isError ? (
        <ItemDetailsError />
      ) : (
        renderItemDetails()
      )}
    </div>
  )

  function renderItemDetails() {
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.tableContainer}>
          {(item?.is_new || item?.is_changed) && (
            <div
              className={`${styles.notificationPanel} ${item?.is_new ? styles.newItem : styles.changedItem}`}
            >
              {item?.is_new ? (
                t('itemDetails.new')
              ) : hasChangedProperties ? (
                <a
                  href="#changes-section"
                  className={styles.notificationLink}
                  onClick={() => {
                    setShowChangedProperties(true)
                  }}
                >
                  {t('itemDetails.changed')}
                </a>
              ) : (
                t('itemDetails.changed')
              )}
            </div>
          )}
          <div className={styles.itemHeader}>
            <div className={styles.headerLeft}>
              <Image
                src={`/icon/${item?.icon?.[0].split('.').at(-1)}.webp`}
                alt={item?.name || item?.object_name || ''}
                width={64}
                height={64}
                className={styles.icon}
              />
              <h1>{item?.name || item?.object_name}</h1>
            </div>
            {item && <ExternalLinks data={item} />}
          </div>

          <div className={styles.description}>
            {item?.description?.replace(/\\n/g, '\n') ||
              'No description available.'}
          </div>

          <div className={styles.stats}>
            {priorityPropertyOrder.map((priorityKey) => {
              const actualKey = Object.keys(item || {}).find(
                (key) => key.toLowerCase() === priorityKey,
              )

              if (!actualKey) return null
              const value = item?.[actualKey as keyof Item]

              return (
                <div key={actualKey} className={styles.statRow}>
                  <span className={styles.label}>
                    {formatColumnName(actualKey)}:
                  </span>
                  <span className={styles.value}>
                    {actualKey.toLowerCase() === 'crystal_type'
                      ? String(value).toLowerCase() === 'none'
                        ? String(value)
                        : String(value).toUpperCase()
                      : Array.isArray(value)
                        ? value.join(', ')
                        : String(value)}
                  </span>
                </div>
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
                <div key={key} className={styles.statRow}>
                  <span className={styles.label}>{formatColumnName(key)}:</span>
                  <span className={styles.value}>
                    {Array.isArray(value)
                      ? value.join(', ')
                      : value?.toString()}
                    {isChanged && (
                      <span className={styles.changedTag}>(changed)</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>

          {hasChangedProperties && (
            <div className={styles.meshTextureSection} id="changes-section">
              <button
                className={styles.collapseButton}
                onClick={() => setShowChangedProperties(!showChangedProperties)}
              >
                {showChangedProperties ? '−' : '+'} Changed Properties
              </button>

              {showChangedProperties && (
                <div className={styles.meshTextureContent}>
                  {Object.entries(item.changes || {}).map(
                    ([key, { old: oldValue, new: newValue }]) => {
                      const isNumeric =
                        !isNaN(Number(oldValue)) && !isNaN(Number(newValue))

                      return (
                        <div key={key} className={styles.statRow}>
                          <span className={styles.label}>
                            {formatColumnName(key)}:
                          </span>
                          <span className={styles.value}>
                            {isNumeric ? (
                              <>
                                {oldValue?.toString()}
                                {Number(newValue) > Number(oldValue) ? (
                                  <>
                                    {' '}
                                    <span className={styles.increased}>
                                      →
                                    </span>{' '}
                                    {newValue?.toString()}
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <span className={styles.decreased}>
                                      →
                                    </span>{' '}
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
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
              )}
            </div>
          )}

          {hasDropProperties && (
            <div className={styles.meshTextureSection}>
              <button
                className={styles.collapseButton}
                onClick={() => setShowDropProperties(!showDropProperties)}
              >
                {showDropProperties ? '−' : '+'} Drop Properties
              </button>

              {showDropProperties && (
                <div className={styles.meshTextureContent}>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isDropProperty(key)) return null

                    return (
                      <div key={key} className={styles.statRow}>
                        <span className={styles.label}>
                          {formatColumnName(key)}:
                        </span>
                        <span className={styles.value}>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {hasMeshTextureProperties && (
            <div className={styles.meshTextureSection}>
              <button
                className={styles.collapseButton}
                onClick={() => setShowMeshTexture(!showMeshTexture)}
              >
                {showMeshTexture ? '−' : '+'} Mesh, Texture & Projectile
                Properties
              </button>

              {showMeshTexture && (
                <div className={styles.meshTextureContent}>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isMeshTextureProperty(key)) return null

                    return (
                      <div key={key} className={styles.statRow}>
                        <span className={styles.label}>
                          {formatColumnName(key)}:
                        </span>
                        <span className={styles.value}>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {hasSoundProperties && (
            <div className={styles.meshTextureSection}>
              <button
                className={styles.collapseButton}
                onClick={() => setShowSound(!showSound)}
              >
                {showSound ? '−' : '+'} Sound Properties
              </button>

              {showSound && (
                <div className={styles.meshTextureContent}>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isSoundProperty(key)) return null

                    return (
                      <div key={key} className={styles.statRow}>
                        <span className={styles.label}>
                          {formatColumnName(key)}:
                        </span>
                        <span className={styles.value}>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {hasEffectProperties && (
            <div className={styles.meshTextureSection}>
              <button
                className={styles.collapseButton}
                onClick={() => setShowEffectProperties(!showEffectProperties)}
              >
                {showEffectProperties ? '−' : '+'} Other Properties
              </button>

              {showEffectProperties && (
                <div className={styles.meshTextureContent}>
                  {Object.entries(item || {}).map(([key, value]) => {
                    if (!isEffectProperty(key)) return null

                    return (
                      <div key={key} className={styles.statRow}>
                        <span className={styles.label}>
                          {formatColumnName(key)}:
                        </span>
                        <span className={styles.value}>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value?.toString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {item?.sets && item?.sets.length > 0 && (
          <div className={styles.armorSets}>
            <h2>{t('itemDetails.partOfSets')}</h2>
            {item?.sets.map((armorSet) => (
              <Link
                rel="canonical"
                key={armorSet.id}
                href={`/armorsets/${armorSet.id}`}
                className={styles.setCard}
              >
                <h3 className={styles.setName}>{armorSet.name}</h3>
                <div className={styles.setVisualContainer}>
                  <ArmorSetVisual armorSet={armorSet} />
                </div>
                <div className={styles.setInfo}>
                  <div className={styles.setInfoItem}>
                    <span className={styles.setInfoLabel}>
                      {t('itemDetails.armorType')}:
                    </span>
                    <span className={styles.setInfoValue}>
                      {armorSet.armor_type ||
                        armorSet.items?.[0]?.armor_type ||
                        'N/A'}
                    </span>
                  </div>
                  <div className={styles.setInfoItem}>
                    <span className={styles.setInfoLabel}>
                      {t('itemDetails.basePrice')}:
                    </span>
                    <span className={styles.setInfoValue}>
                      {armorSet.items
                        ?.reduce((sum, item) => sum + (item.base_price || 0), 0)
                        .toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className={styles.setInfoItem}>
                    <span className={styles.setInfoLabel}>
                      {t('itemDetails.pieces')}:
                    </span>
                    <span className={styles.setInfoValue}>
                      {armorSet.items?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }
}
