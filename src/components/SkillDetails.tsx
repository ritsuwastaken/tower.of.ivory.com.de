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
import styled from 'styled-components'
import {
  Container,
  Description,
  ErrorText,
  HeaderLeft,
  HeaderRight,
  HeaderInfo,
  ItemHeader,
  Label,
  MeshTextureContent,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from '@/components/primitives/DetailsPrimitives'

interface SkillDetailsProps {
  id: number
}

const SkillDetailsLoading = () => {
  return (
    <Container>
      <StyledLink rel="canonical" href="/skills">
        ⟵
      </StyledLink>
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
              <HeaderInfo>
                <h1>
                  <Skeleton
                    width={200}
                    height={32}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </h1>
                <MobileLevelSelect>
                  <Skeleton
                    width={100}
                    height={30}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </MobileLevelSelect>
              </HeaderInfo>
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
        </TableContainer>

        <SkillLevels className="desktopOnly">
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
              <LevelCard key={index}>
                <LevelHeader>
                  <LevelNumberContainer>
                    <Skeleton
                      width={80}
                      height={20}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </LevelNumberContainer>
                  <Skeleton
                    width={60}
                    height={20}
                    baseColor="#2a2a2a"
                    highlightColor="#3a3a3a"
                  />
                </LevelHeader>
                {index % 2 === 0 && (
                  <SmallLevelDescription>
                    <Skeleton
                      count={2}
                      baseColor="#2a2a2a"
                      highlightColor="#3a3a3a"
                    />
                  </SmallLevelDescription>
                )}
              </LevelCard>
            ))}
        </SkillLevels>
      </ContentWrapper>
    </Container>
  )
}

const SkillNotFound = () => {
  return (
    <Container>
      <StyledLink rel="canonical" href="/skills">
        ⟵
      </StyledLink>
      <TableContainer>
        <ErrorText>Skill not found</ErrorText>
      </TableContainer>
    </Container>
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
      <Container>
        <StyledLink rel="canonical" href="/skills" scroll={false}>
          ⟵
        </StyledLink>

        <ContentWrapper>
          <TableContainer>
            {skill?.levels?.some(
              (level) => level.is_new || level.is_changed,
            ) && (
              <div
                className={`notificationPanel ${skill.levels?.every((level) => level.is_new) ? 'newItem' : 'changedItem'}`}
              >
                {skill.levels?.every((level) => level.is_new) ? (
                  t('skillDetails.new')
                ) : hasChangedProperties ? (
                  <a
                    href="#changes-section"
                    className="notificationLink"
                    onClick={handleNotificationClick}
                  >
                    {t('skillDetails.changed')}
                  </a>
                ) : (
                  t('skillDetails.changed')
                )}
              </div>
            )}
            <ItemHeader>
              <HeaderLeft>
                <Image
                  src={`/icon/${selectedSkill?.icon?.split('.').at(-1)}.webp`}
                  alt={
                    selectedSkill.name ||
                    `Unnamed skill with id ${selectedSkill.skill_id}`
                  }
                  width={64}
                  height={64}
                  className="icon"
                />
                <HeaderInfo>
                  <h1>{selectedSkill.name}</h1>
                  <MobileLevelSelect>
                    <button
                      className="levelDropdownButton"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      Level {selectedSkill.skill_level}
                      <span className="dropdownArrow">▼</span>
                    </button>
                    {isDropdownOpen && (
                      <div className="mobileDropdown">
                        {skill?.levels?.map((levelData: Skill) => (
                          <button
                            key={levelData.skill_level}
                            className={`mobileDropdownItem ${Number(levelData.skill_level) === Number(selectedSkill.skill_level) ? 'activeItem' : ''}`}
                            onClick={() => handleLevelClick(levelData)}
                          >
                            Level {levelData.skill_level} (MP:{' '}
                            {levelData.mp_consume || 0})
                          </button>
                        ))}
                      </div>
                    )}
                  </MobileLevelSelect>
                </HeaderInfo>
              </HeaderLeft>
              <ExternalLinks data={selectedSkill} />
            </ItemHeader>

            <Description>
              {selectedSkill?.description?.replace(/\\n/g, '\n') ||
                'No description available.'}
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
              <MeshTextureSection id="changes-section">
                <button
                  className="collapseButton"
                  onClick={() =>
                    setShowChangedProperties(!showChangedProperties)
                  }
                >
                  {showChangedProperties ? '−' : '+'} Changed Properties
                </button>

                {showChangedProperties && (
                  <MeshTextureContent>
                    {Object.entries(selectedSkill.changes || {}).map(
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
          </TableContainer>

          <SkillLevels className="desktopOnly">
            <h2>{t('skillDetails.levels')}</h2>
            {skill?.levels?.map((levelData: Skill) => {
              const isDefault = levelData.skill_level === 1
              const hasDifferentDescription =
                levelData.description !== skill?.levels?.[0].description
              const mpConsume = levelData.mp_consume || 0
              const hpConsume = levelData.hp_consume || 0
              return (
                <LevelCard
                  key={levelData.skill_level}
                  className={`${Number(levelData.skill_level) === Number(selectedSkill.skill_level) ? 'activeLevel' : ''}`}
                  onClick={() => handleLevelClick(levelData)}
                >
                  <LevelHeader>
                    <LevelNumberContainer>
                      <span className="levelNumber">
                        {t('skillDetails.level')} {levelData.skill_level}
                      </span>
                      {levelData.is_new && (
                        <span className={`levelTag newTag`}>
                          {t('badge.new')}
                        </span>
                      )}
                      {levelData.is_changed && !levelData.is_new && (
                        <span className={`levelTag changedTag`}>
                          {t('badge.changed')}
                        </span>
                      )}
                    </LevelNumberContainer>
                    <span className="consume">
                      <span className="mpConsume">{mpConsume}</span> |{' '}
                      <span className="hpConsume">{hpConsume}</span>
                    </span>
                  </LevelHeader>
                  {hasDifferentDescription && !isDefault && (
                    <SmallLevelDescription>
                      {levelData?.description?.replace(/\\n/g, '\n') ||
                        'No description available.'}
                    </SmallLevelDescription>
                  )}
                </LevelCard>
              )
            })}
          </SkillLevels>
        </ContentWrapper>
      </Container>
    </>
  )
}

const StyledLink = styled(Link)`
  display: inline-block;
  color: #888;
  text-decoration: none;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const MobileLevelSelect = styled.div`
  display: none;
  position: relative;
  width: 100%;
  max-width: 250px;

  .levelDropdownButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    color: #fff;
    font-size: 0.875rem;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s ease;
  }

  .levelDropdownButton:hover {
    background: #333;
  }

  .dropdownArrow {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  .mobileDropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    margin-top: 0.25rem;
    max-height: 300px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .mobileDropdownItem {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-bottom: 1px solid #333;
    color: #ddd;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s ease;
  }

  .mobileDropdownItem:last-child {
    border-bottom: none;
  }

  .mobileDropdownItem:hover {
    background: #333;
  }

  .activeItem {
    background: #444 !important;
    color: #fff;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    display: block;
    position: relative;
  }
`

const SkillLevels = styled.div`
  width: 300px;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  font-size: 0.875rem;

  h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const LevelCard = styled.button`
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
  background: var(--background-darker);
  border-radius: 6px;
  transition: all 0.2s ease;
  color: var(--text-color);

  &.activeLevel {
    background: #4a4a4a !important;
    font-weight: 500;
  }
`

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .consume {
    color: #4a4a4a;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .mpConsume {
    color: #4499ff;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .hpConsume {
    color: #ff4444;
    font-size: 0.875rem;
    white-space: nowrap;
  }
`

const LevelNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .levelNumber {
    font-weight: 500;
    font-size: 0.875rem;
  }

  .levelTag {
    font-size: 0.65rem;
    font-weight: bold;
    padding: 1px 4px;
    border-radius: 3px;
    display: inline-block;
  }

  .newTag {
    background-color: #4caf50;
    color: white;
  }

  .changedTag {
    background-color: #ff9800;
    color: white;
  }
`

const SmallLevelDescription = styled.div`
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  line-height: 1.4;
`
