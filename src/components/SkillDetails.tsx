'use client'

import {
  MobileLevelSelect,
  SkillLevels,
  LevelCard,
  LevelHeader,
  LevelNumberContainer,
  SmallLevelDescription,
  LevelSelect,
  LevelNumber,
  Consume,
  MpConsume,
  HpConsume,
  LevelTag,
} from '@/components/SkillDetails.styles'

import { ChangedProperties } from '@/components/DetailsSections'
import {
  SearchParamsBoundary,
  useCatalogSearchParams,
} from '@/components/SearchParamsBoundary'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLinks } from '@/components/ExternalLinks'
import {
  BackButton,
  NotificationPanel,
  NotificationLink,
  DetailIcon,
  ContentWrapper,
  Description,
  ErrorText,
  HeaderLeft,
  HeaderInfo,
  ItemHeader,
  Label,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from '@/components/Details.styles'

const SkillNotFound = () => {
  const { t } = useTranslation()
  return (
    <div>
      <BackButton as={Link} href="/skills">
        ⟵
      </BackButton>
      <TableContainer>
        <ErrorText>{t('meta.skillNotFound')}</ErrorText>
      </TableContainer>
    </div>
  )
}

export default function SkillDetails({ skill }: { skill: Skill }) {
  const [title, setTitle] = useState(
    `${skill.name || 'Skill'} · Lvl. ${skill.skill_level ?? 1} · Skills | Tower of Ivory`,
  )

  return (
    <>
      <title>{title}</title>
      <SearchParamsBoundary>
        <SkillDetailsContent skill={skill} onTitleChange={setTitle} />
      </SearchParamsBoundary>
    </>
  )
}

function SkillDetailsContent({
  skill,
  onTitleChange,
}: {
  skill: Skill
  onTitleChange: (title: string) => void
}) {
  const searchParams = useCatalogSearchParams()
  const showChanges = searchParams.get('show') === 'changes'
  const skillLevel = Number(searchParams.get('level')) || skill.skill_level || 1
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()

  const [showChangedProperties, setShowChangedProperties] = useState(false)

  useEffect(() => {
    const shouldShowChanges =
      window.location.hash === '#changes-section' || showChanges

    if (shouldShowChanges) {
      const showChangesTimeout = window.setTimeout(() => {
        setShowChangedProperties(true)
      }, 0)
      const scrollTimeout = window.setTimeout(() => {
        const changesSection = document.getElementById('changes-section')
        if (changesSection) {
          changesSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)

      return () => {
        window.clearTimeout(showChangesTimeout)
        window.clearTimeout(scrollTimeout)
      }
    }
  }, [showChanges])

  const selectedSkill =
    skill.levels?.find((level) => level.skill_level === skillLevel) ?? null

  const pageTitle = selectedSkill
    ? t('skillDetails.pageTitle', {
        name:
          selectedSkill.name ||
          t('skillDetails.unnamedSkill', { id: selectedSkill.skill_id }),
        level: selectedSkill.skill_level ?? 1,
        section: t('navigation.skills'),
      })
    : t('meta.skillNotFound')

  useEffect(() => {
    onTitleChange(`${pageTitle} | Tower of Ivory`)
  }, [pageTitle, onTitleChange])

  const handleLevelChange = (level: number | undefined) => {
    const params = new URLSearchParams(searchParams)
    params.set('level', String(level))
    window.history.pushState(null, '', `?${params}`)
  }

  if (!selectedSkill) {
    return <SkillNotFound />
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
      <div>
        <BackButton as={Link} href="/skills" scroll={false}>
          ⟵
        </BackButton>

        <ContentWrapper>
          <TableContainer>
            {skill.levels?.some(
              (level) => level.is_new || level.is_changed,
            ) && (
              <NotificationPanel
                $isNew={!!skill.levels?.every((level) => level.is_new)}
              >
                {skill.levels?.every((level) => level.is_new) ? (
                  t('skillDetails.new')
                ) : hasChangedProperties ? (
                  <NotificationLink
                    href="#changes-section"
                    onClick={handleNotificationClick}
                  >
                    {t('skillDetails.changed')}
                  </NotificationLink>
                ) : (
                  t('skillDetails.changed')
                )}
              </NotificationPanel>
            )}
            <ItemHeader>
              <HeaderLeft>
                <DetailIcon
                  icon={selectedSkill.icon?.toLowerCase()}
                  fallback="skill0000"
                  alt={
                    selectedSkill.name ||
                    t('skillDetails.unnamedSkill', {
                      id: selectedSkill.skill_id,
                    })
                  }
                  width={64}
                  height={64}
                />
                <HeaderInfo>
                  <h1>{selectedSkill.name}</h1>
                  <MobileLevelSelect>
                    <LevelSelect
                      aria-label={t('skillDetails.level')}
                      value={selectedSkill.skill_level}
                      onChange={(event) =>
                        handleLevelChange(Number(event.target.value))
                      }
                    >
                      {skill.levels?.map((levelData) => (
                        <option
                          key={levelData.skill_level}
                          value={levelData.skill_level}
                        >
                          {t('skillDetails.levelWithMp', {
                            level: levelData.skill_level,
                            mp: levelData.mp_consume || 0,
                          })}
                        </option>
                      ))}
                    </LevelSelect>
                  </MobileLevelSelect>
                </HeaderInfo>
              </HeaderLeft>
              <ExternalLinks data={selectedSkill} />
            </ItemHeader>

            <Description>
              {selectedSkill?.description?.replace(/\\n/g, '\n') ||
                t('details.noDescription')}
            </Description>

            <Stats>
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
            </Stats>

            {hasChangedProperties && (
              <ChangedProperties
                changes={selectedSkill.changes || {}}
                open={showChangedProperties}
                onToggle={() =>
                  setShowChangedProperties(!showChangedProperties)
                }
              />
            )}
          </TableContainer>

          <SkillLevels>
            <h2>{t('skillDetails.levels')}</h2>
            {skill.levels?.map((levelData: Skill) => {
              const isDefault = levelData.skill_level === 1
              const hasDifferentDescription =
                levelData.description !== skill.levels?.[0].description
              const mpConsume = levelData.mp_consume || 0
              const hpConsume = levelData.hp_consume || 0
              return (
                <LevelCard
                  key={levelData.skill_level}
                  $active={
                    Number(levelData.skill_level) ===
                    Number(selectedSkill.skill_level)
                  }
                  onClick={() => handleLevelChange(levelData.skill_level)}
                >
                  <LevelHeader>
                    <LevelNumberContainer>
                      <LevelNumber>
                        {t('skillDetails.level')} {levelData.skill_level}
                      </LevelNumber>
                      {levelData.is_new && (
                        <LevelTag $isNew>{t('badge.new')}</LevelTag>
                      )}
                      {levelData.is_changed && !levelData.is_new && (
                        <LevelTag $isNew={false}>{t('badge.changed')}</LevelTag>
                      )}
                    </LevelNumberContainer>
                    <Consume>
                      <MpConsume>{mpConsume}</MpConsume> |{' '}
                      <HpConsume>{hpConsume}</HpConsume>
                    </Consume>
                  </LevelHeader>
                  {hasDifferentDescription && !isDefault && (
                    <SmallLevelDescription>
                      {levelData?.description?.replace(/\\n/g, '\n') ||
                        t('details.noDescription')}
                    </SmallLevelDescription>
                  )}
                </LevelCard>
              )
            })}
          </SkillLevels>
        </ContentWrapper>
      </div>
    </>
  )
}
