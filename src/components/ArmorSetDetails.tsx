import { ArmorSet } from '@/types/armorset'
import { getTotalBasePrice, getTotalPhysicalDefense } from '@/utils/getTotalX'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import { ArmorSetVisual } from './ArmorSetVisual'
import { ExternalLinks } from './ExternalLinks'
import { Head } from './Head'
import styles from './ItemDetails.module.css'

interface ArmorSetDetailsProps {
  id: string
}

const ArmorSetDetailsLoading = () => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.itemHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.icon}>
            <Skeleton
              width={150}
              height={150}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </div>
          <div className={styles.headerInfo}>
            <h1>
              <Skeleton
                width={200}
                height={32}
                baseColor="#2a2a2a"
                highlightColor="#3a3a3a"
              />
            </h1>
            <div>
              <Skeleton
                width={100}
                height={20}
                baseColor="#2a2a2a"
                highlightColor="#3a3a3a"
              />
            </div>
            <div className={styles.totalDefense}>
              <Skeleton
                width={150}
                height={20}
                baseColor="#2a2a2a"
                highlightColor="#3a3a3a"
              />
            </div>
            <div className={styles.totalPrice}>
              <Skeleton
                width={180}
                height={20}
                baseColor="#2a2a2a"
                highlightColor="#3a3a3a"
              />
            </div>
          </div>
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
        <Skeleton count={2} baseColor="#2a2a2a" highlightColor="#3a3a3a" />
      </div>

      <div className={styles.partsContainer}>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className={styles.partRow}>
              <div className={styles.partDetails}>
                <div className={styles.partHeaderContainer}>
                  <div className={styles.partIconColumn}>
                    <div className={styles.partIcon}>
                      <Skeleton
                        borderRadius={4}
                        width={45}
                        height={45}
                        baseColor="#2a2a2a"
                        highlightColor="#3a3a3a"
                      />
                    </div>
                  </div>
                  <div className={styles.partHeader}>
                    <div className={styles.partMainContainer}>
                      <div className={styles.partMain}>
                        <Skeleton
                          width={150}
                          height={24}
                          baseColor="#2a2a2a"
                          highlightColor="#3a3a3a"
                        />
                      </div>
                      <div className={styles.partParams}>
                        <span className={styles.partParam}>
                          <Skeleton
                            width={120}
                            height={18}
                            baseColor="#2a2a2a"
                            highlightColor="#3a3a3a"
                          />
                        </span>
                        <span className={styles.partParam}>
                          <Skeleton
                            width={80}
                            height={18}
                            baseColor="#2a2a2a"
                            highlightColor="#3a3a3a"
                          />
                        </span>
                        <span className={styles.partParam}>
                          <Skeleton
                            width={100}
                            height={18}
                            baseColor="#2a2a2a"
                            highlightColor="#3a3a3a"
                          />
                        </span>
                      </div>
                    </div>
                    <div className={styles.partLinks}>
                      <Skeleton
                        width={80}
                        height={24}
                        baseColor="#2a2a2a"
                        highlightColor="#3a3a3a"
                      />
                    </div>
                  </div>
                </div>
                {index % 2 === 0 && (
                  <div className={styles.description}>
                    <Skeleton
                      count={1}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export const ArmorSetDetails = ({ id }: ArmorSetDetailsProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    data: armorSet,
    isLoading,
    isError,
  } = useQuery<ArmorSet, Error>({
    queryKey: ['armorSet', id],
    queryFn: async () => {
      const response = await fetch('/data/armorsets.json')
      if (!response.ok) {
        throw new Error('Failed to fetch armor sets')
      }
      const sets: ArmorSet[] = await response.json()
      const set = sets.find((s) => String(s.id) === String(id))
      if (!set) {
        throw new Error('Armor set not found')
      }
      return set
    },
  })

  const chestPiece = armorSet?.items?.find(
    ({ armor_type }) => armor_type?.toLowerCase() === 'chest',
  )
  const totalPhysicalDefense = armorSet?.items
    ? getTotalPhysicalDefense(armorSet?.items)
    : 0
  const totalBasePrice = armorSet?.items
    ? getTotalBasePrice(armorSet?.items)
    : 0

  return (
    <div className={styles.container}>
      <Head
        description={
          isLoading
            ? 'Loading...'
            : isError
              ? 'Armor Set Not Found'
              : armorSet?.name
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
        <ArmorSetDetailsLoading />
      ) : isError ? (
        <div className={styles.tableContainer}>
          <div className={styles.error}>{t('armorSetDetails.notFound')}</div>
        </div>
      ) : (
        renderDetails()
      )}
    </div>
  )

  function renderDetails() {
    if (!armorSet) return null
    return (
      <div className={styles.tableContainer}>
        <div className={styles.itemHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.icon}>
              <ArmorSetVisual armorSet={armorSet} />
            </div>
            <div className={styles.headerInfo}>
              <h1>{armorSet.name}</h1>
              {armorSet.grade && (
                <div>
                  {t('filters.grade')}:{' '}
                  {armorSet.grade.toLowerCase() === 'none'
                    ? 'None'
                    : armorSet.grade.toUpperCase()}
                </div>
              )}
              {totalPhysicalDefense > 0 && (
                <div className={styles.totalDefense}>
                  {t('armorSetDetails.totalPDef')}:{' '}
                  <strong>{totalPhysicalDefense}</strong>
                </div>
              )}
              {totalBasePrice > 0 && (
                <div className={styles.totalPrice}>
                  {t('armorSetDetails.basePrice')}:{' '}
                  <strong>{totalBasePrice.toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>
          <div className={styles.headerRight}>
            {!!chestPiece && <ExternalLinks data={chestPiece} />}
          </div>
        </div>

        {armorSet.set_bonus && (
          <div className={styles.description}>
            <strong>{t('armorSetsPage.setBonus')}:</strong> {armorSet.set_bonus}
          </div>
        )}

        <div className={styles.partsContainer}>
          {armorSet.items &&
            armorSet.items.map((item, index) => (
              <div key={index} className={styles.partRow}>
                <div className={styles.partDetails}>
                  <div className={styles.partHeaderContainer}>
                    <div className={styles.partIconColumn}>
                      {item.icon && (
                        <div className={styles.partIcon}>
                          <Image
                            src={`/icon/${item?.icon?.[0]?.split('.')[1]}.webp`}
                            alt={
                              item.name ||
                              `${t('armorSetDetails.unnamedItem')} ${item.object_id}`
                            }
                            width={45}
                            height={45}
                            className={styles.partIconImage}
                          />
                        </div>
                      )}
                    </div>
                    <div className={styles.partHeader}>
                      <div className={styles.partMainContainer}>
                        <div className={styles.partMain}>
                          <a
                            href={`/items/${item.object_id}`}
                            className={styles.partLink}
                          >
                            <span className={styles.partName}>{item.name}</span>
                          </a>
                        </div>
                        <div className={styles.partParams}>
                          {item.body_part && (
                            <span className={styles.partParam}>
                              <span className={styles.paramLabel}>
                                {t('armorSetDetails.part')}:
                              </span>
                              <span className={styles.paramValue}>
                                {item.body_part
                                  .map((part) => {
                                    const words = part.toLowerCase().split(' ')
                                    words[0] =
                                      words[0].charAt(0).toUpperCase() +
                                      words[0].slice(1)
                                    return words.join(' ')
                                  })
                                  .join(', ')}
                              </span>
                            </span>
                          )}
                          {item.physical_defense && (
                            <span className={styles.partParam}>
                              <span className={styles.paramLabel}>
                                {t('armorSetDetails.pDef')}:
                              </span>
                              <span className={styles.paramValue}>
                                {item.physical_defense}
                              </span>
                            </span>
                          )}
                          {item.base_price && (
                            <span className={styles.partParam}>
                              <span className={styles.paramLabel}>
                                {t('armorSetDetails.basePrice')}:
                              </span>
                              <span className={styles.paramValue}>
                                {item.base_price.toLocaleString()}
                              </span>
                            </span>
                          )}
                          {item.crystal_count && (
                            <span className={styles.partParam}>
                              <span className={styles.paramLabel}>
                                {t('armorSetDetails.crystalCount')}:
                              </span>
                              <span className={styles.paramValue}>
                                {item.crystal_count}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.partLinks}>
                        <ExternalLinks data={item} />
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <div className={styles.description}>
                      {item.description.replace(/\\n/g, '\n')}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }
}
