import { Head } from '@/components/Head'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types/skill'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ExternalLinks } from './ExternalLinks'
import styles from './ItemDetails.module.css'

interface SkillDetailsProps {
  id: number
}

const SkillDetailsLoading = () => {
  return (
    <div className={styles.container}>
      <Link rel="canonical" href="/skills" className={styles.backButton}>
        ⟵
      </Link>
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
              <div className={styles.headerInfo}>
                <h1>
                  <Skeleton
                    width={200}
                    height={32}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </h1>
                <div className={styles.mobileLevelSelect}>
                  <Skeleton
                    width={100}
                    height={30}
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
        </div>

        <div className={`${styles.skillLevels} ${styles.desktopOnly}`}>
          <h2>
            <Skeleton
              width={100}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          </h2>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.levelCard}>
                <div className={styles.levelHeader}>
                  <div className={styles.levelNumberContainer}>
                    <Skeleton
                      width={80}
                      height={20}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </div>
                  <Skeleton
                    width={60}
                    height={20}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </div>
                {index % 2 === 0 && (
                  <div className={styles.levelDescription}>
                    <Skeleton
                      count={2}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

const SkillNotFound = () => {
  return (
    <div className={styles.container}>
      <Link rel="canonical" href="/skills" className={styles.backButton}>
        ⟵
      </Link>
      <div className={styles.tableContainer}>
        <div className={styles.error}>Skill not found</div>
      </div>
    </div>
  )
}

export const SkillDetails = ({ id }: SkillDetailsProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showChangedProperties, setShowChangedProperties] =
    React.useState(false)
  const searchParams = useSearchParams()
  const [skillLevel, setSkillLevel] = useState(
    Number(searchParams.get('level')) || 1,
  )

  const {
    data: skill,
    isLoading,
    isError,
  } = useQuery<Skill, Error>({
    queryKey: ['skill', id],
    queryFn: async () => {
      const response = await fetch('/data/skills.json')
      if (!response.ok) {
        throw new Error('Failed to fetch skills data')
      }
      const allSkills: Skill[] = await response.json()
      const levels = allSkills.filter((s) => s.skill_id === id)
      const base = levels[0]
      if (!base) {
        throw new Error('Skill not found')
      }
      return { ...base, levels }
    },
  })

  React.useEffect(() => {
    if (!isLoading && skill) {
      const shouldShowChanges =
        window.location.hash === '#changes-section' ||
        searchParams.get('show') === 'changes'

      if (shouldShowChanges) {
        setShowChangedProperties(true)
        setTimeout(() => {
          const changesSection = document.getElementById('changes-section')
          if (changesSection) {
            changesSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [isLoading, skill, searchParams])

  const selectedSkill: Omit<Skill, 'levels'> | null = useMemo(() => {
    if (!skill) return null
    return (
      skill.levels?.find((level) => level.skill_level === Number(skillLevel)) ??
      null
    )
  }, [skill, skillLevel])

  const handleLevelClick = (levelData: Skill) => {
    if (!skill) return

    router.push(`/skills/${id}?level=${levelData.skill_level}`, {
      scroll: false,
    })
    setIsDropdownOpen(false)
    setSkillLevel(levelData.skill_level ?? 1)
  }

  if (isLoading) {
    return (
      <>
        <Head description="Loading..." />
        <SkillDetailsLoading />
      </>
    )
  }

  if (!selectedSkill || isError) {
    return (
      <>
        <Head description="Error" />
        <SkillNotFound />
      </>
    )
  }

  const hasChangedProperties =
    selectedSkill.is_changed &&
    selectedSkill.changes &&
    Object.keys(selectedSkill.changes).length > 0
  const handleNotificationClick = () => {
    setShowChangedProperties(true)
  }

  return (
    <>
      <Head
        description={`${selectedSkill.name} Lvl. ${selectedSkill.skill_level} | Skills`}
      />
      <div className={styles.container}>
        <Link
          rel="canonical"
          href="/skills"
          className={styles.backButton}
          scroll={false}
        >
          ⟵
        </Link>

        <div className={styles.contentWrapper}>
          <div className={styles.tableContainer}>
            {skill?.levels?.some(
              (level) => level.is_new || level.is_changed,
            ) && (
              <div
                className={`${styles.notificationPanel} ${skill.levels?.every((level) => level.is_new) ? styles.newItem : styles.changedItem}`}
              >
                {skill.levels?.every((level) => level.is_new) ? (
                  t('skillDetails.new')
                ) : hasChangedProperties ? (
                  <a
                    href="#changes-section"
                    className={styles.notificationLink}
                    onClick={handleNotificationClick}
                  >
                    {t('skillDetails.changed')}
                  </a>
                ) : (
                  t('skillDetails.changed')
                )}
              </div>
            )}
            <div className={styles.itemHeader}>
              <div className={styles.headerLeft}>
                <Image
                  src={`/icon/${selectedSkill?.icon?.split('.').at(-1)}.webp`}
                  alt={
                    selectedSkill.name ||
                    `Unnamed skill with id ${selectedSkill.skill_id}`
                  }
                  width={64}
                  height={64}
                  className={styles.icon}
                />
                <div className={styles.headerInfo}>
                  <h1>{selectedSkill.name}</h1>
                  <div className={styles.mobileLevelSelect}>
                    <button
                      className={styles.levelDropdownButton}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      Level {selectedSkill.skill_level}
                      <span className={styles.dropdownArrow}>▼</span>
                    </button>
                    {isDropdownOpen && (
                      <div className={styles.mobileDropdown}>
                        {skill?.levels?.map((levelData: Skill) => (
                          <button
                            key={levelData.skill_level}
                            className={`${styles.mobileDropdownItem} ${Number(levelData.skill_level) === Number(selectedSkill.skill_level) ? styles.activeItem : ''}`}
                            onClick={() => handleLevelClick(levelData)}
                          >
                            Level {levelData.skill_level} (MP:{' '}
                            {levelData.mp_consume || 0})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ExternalLinks data={selectedSkill} />
            </div>

            <div className={styles.description}>
              {selectedSkill?.description?.replace(/\\n/g, '\n') ||
                'No description available.'}
            </div>

            <div className={styles.stats}>
              {Object.entries(selectedSkill).map(([key, value]) => {
                if (
                  key === 'icon' ||
                  key === 'name' ||
                  key === 'description' ||
                  key === 'levels' ||
                  key === 'is_new' ||
                  key === 'is_changed' ||
                  key === 'changes'
                )
                  return null

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

            {hasChangedProperties && (
              <div className={styles.meshTextureSection} id="changes-section">
                <button
                  className={styles.collapseButton}
                  onClick={() =>
                    setShowChangedProperties(!showChangedProperties)
                  }
                >
                  {showChangedProperties ? '−' : '+'} Changed Properties
                </button>

                {showChangedProperties && (
                  <div className={styles.meshTextureContent}>
                    {Object.entries(selectedSkill.changes || {}).map(
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
          </div>

          <div className={`${styles.skillLevels} ${styles.desktopOnly}`}>
            <h2>{t('skillDetails.levels')}</h2>
            {skill?.levels?.map((levelData: Skill) => {
              const isDefault = levelData.skill_level === 1
              const hasDifferentDescription =
                levelData.description !== skill?.levels?.[0].description
              const mpConsume = levelData.mp_consume || 0
              const hpConsume = levelData.hp_consume || 0
              return (
                <button
                  key={levelData.skill_level}
                  className={`${styles.levelCard} ${Number(levelData.skill_level) === Number(selectedSkill.skill_level) ? styles.activeLevel : ''}`}
                  onClick={() => handleLevelClick(levelData)}
                >
                  <div className={styles.levelHeader}>
                    <div className={styles.levelNumberContainer}>
                      <span className={styles.levelNumber}>
                        {t('skillDetails.level')} {levelData.skill_level}
                      </span>
                      {levelData.is_new && (
                        <span className={`${styles.levelTag} ${styles.newTag}`}>
                          {t('badge.new')}
                        </span>
                      )}
                      {levelData.is_changed && !levelData.is_new && (
                        <span
                          className={`${styles.levelTag} ${styles.changedTag}`}
                        >
                          {t('badge.changed')}
                        </span>
                      )}
                    </div>
                    <span className={styles.consume}>
                      <span className={styles.mpConsume}>{mpConsume}</span> |{' '}
                      <span className={styles.hpConsume}>{hpConsume}</span>
                    </span>
                  </div>
                  {hasDifferentDescription && !isDefault && (
                    <div className={styles.levelDescription}>
                      {levelData?.description?.replace(/\\n/g, '\n') ||
                        'No description available.'}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
