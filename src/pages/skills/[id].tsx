import { getStaticPathsFor } from '@/utils/staticPages'
import { useRouter } from 'next/router'
import { ChangedProperties, LoadingStats } from '@/components/DetailsSections'
import { Head } from '@/components/Head'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types'
import { useDataUrl } from '@/hooks/useDataUrl'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLinks } from '@/components/ExternalLinks'
import styled, { css } from 'styled-components'
import {
  Container,
  NotificationPanel,
  NotificationLink,
  DetailIcon,
  ContentWrapper,
  Description,
  ErrorText,
  HeaderLeft,
  HeaderRight,
  HeaderInfo,
  ItemHeader,
  Label,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from '@/components/primitives/DetailsPrimitives'
import { Skeleton } from '@/components/Skeleton'

const SkillPageLoading = () => {
  return (
    <Container>
      <StyledLink rel="canonical" href="/skills">
        ⟵
      </StyledLink>
      <ContentWrapper>
        <TableContainer>
          <ItemHeader>
            <HeaderLeft>
              <Skeleton borderRadius={8} width={64} height={64} />
              <HeaderInfo>
                <h1>
                  <Skeleton width={200} height={32} />
                </h1>
                <MobileLevelSelect>
                  <Skeleton width={100} height={30} />
                </MobileLevelSelect>
              </HeaderInfo>
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
        </TableContainer>

        <SkillLevels>
          <h2>
            <Skeleton width={100} />
          </h2>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <LevelCard key={index}>
                <LevelHeader>
                  <LevelNumberContainer>
                    <Skeleton width={80} height={20} />
                  </LevelNumberContainer>
                  <Skeleton width={60} height={20} />
                </LevelHeader>
                {index % 2 === 0 && (
                  <SmallLevelDescription>
                    <Skeleton count={2} />
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
  const { t } = useTranslation()
  return (
    <Container>
      <StyledLink rel="canonical" href="/skills">
        ⟵
      </StyledLink>
      <TableContainer>
        <ErrorText>{t('meta.skillNotFound')}</ErrorText>
      </TableContainer>
    </Container>
  )
}

export default function SkillPage() {
  const getDataUrl = useDataUrl()
  const router = useRouter()
  const idParam = router.query.id
  const id = idParam ? parseInt(idParam as string, 10) : undefined
  const skillLevel = Number(router.query.level) || 1
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showChangedProperties, setShowChangedProperties] = useState(false)

  const {
    data: skill,
    isLoading,
    isError,
  } = useQuery<Skill, Error>({
    queryKey: ['skill', id],
    enabled: !!idParam,
    queryFn: async () => {
      const response = await fetch(getDataUrl('/data/skills.json'))
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

  useEffect(() => {
    if (!isLoading && skill) {
      const shouldShowChanges =
        window.location.hash === '#changes-section' ||
        router.query.show === 'changes'

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
    }
  }, [isLoading, skill, router.query.show])

  const selectedSkill: Omit<Skill, 'levels'> | null = useMemo(() => {
    if (!skill) return null
    return (
      skill.levels?.find((level) => level.skill_level === Number(skillLevel)) ??
      null
    )
  }, [skill, skillLevel])

  const handleLevelClick = (levelData: Skill) => {
    if (!skill) return

    router.push(`/skills/${id}?level=${levelData.skill_level}`, undefined, {
      scroll: false,
    })
    setIsDropdownOpen(false)
  }

  if (!idParam) return null

  if (isLoading) {
    return (
      <>
        <Head description={t('meta.loading')} />
        <SkillPageLoading />
      </>
    )
  }

  if (!selectedSkill || isError) {
    return (
      <>
        <Head description={t('meta.skillNotFound')} />
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
        description={t('skillDetails.pageTitle', {
          name:
            selectedSkill.name ||
            t('skillDetails.unnamedSkill', { id: selectedSkill.skill_id }),
          level: selectedSkill.skill_level ?? 1,
          section: t('navigation.skills'),
        })}
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
                  src={getDataUrl(
                    `/icon/${selectedSkill?.icon?.toLowerCase()?.split('.').at(-1)}.webp`,
                  )}
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
                    <LevelDropdownButton
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {t('skillDetails.levelShort', {
                        level: selectedSkill.skill_level,
                      })}
                      <DropdownArrow>▼</DropdownArrow>
                    </LevelDropdownButton>
                    {isDropdownOpen && (
                      <MobileDropdown>
                        {skill?.levels?.map((levelData: Skill) => (
                          <MobileDropdownItem
                            key={levelData.skill_level}
                            $active={
                              Number(levelData.skill_level) ===
                              Number(selectedSkill.skill_level)
                            }
                            onClick={() => handleLevelClick(levelData)}
                          >
                            {t('skillDetails.levelWithMp', {
                              level: levelData.skill_level,
                              mp: levelData.mp_consume || 0,
                            })}
                          </MobileDropdownItem>
                        ))}
                      </MobileDropdown>
                    )}
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
            {skill?.levels?.map((levelData: Skill) => {
              const isDefault = levelData.skill_level === 1
              const hasDifferentDescription =
                levelData.description !== skill?.levels?.[0].description
              const mpConsume = levelData.mp_consume || 0
              const hpConsume = levelData.hp_consume || 0
              return (
                <LevelCard
                  key={levelData.skill_level}
                  $active={
                    Number(levelData.skill_level) ===
                    Number(selectedSkill.skill_level)
                  }
                  onClick={() => handleLevelClick(levelData)}
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

const MobileLevelSelect = styled.div`
  display: none;
  position: relative;
  width: 100%;
  max-width: 250px;

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

const LevelCard = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: var(--text-color);
  background-color: transparent;

  ${({ $active }) =>
    $active &&
    css`
      background: #4a4a4a !important;
      font-weight: 500;
    `}
`

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const LevelNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const SmallLevelDescription = styled.div`
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  line-height: 1.4;
`

const LevelDropdownButton = styled.button`
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
  &:hover {
    background: #333;
  }
`

const DropdownArrow = styled.span`
  font-size: 0.75rem;
  transition: transform 0.2s ease;
`

const MobileDropdown = styled.div`
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
`

const MobileDropdownItem = styled.button<{ $active: boolean }>`
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
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #333;
  }
  ${({ $active }) =>
    $active &&
    css`
      background: #444 !important;
      color: #fff;
      font-weight: 500;
    `}
`

const LevelNumber = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`

const Consume = styled.span`
  color: #4a4a4a;
  font-size: 0.875rem;
  white-space: nowrap;
`

const MpConsume = styled.span`
  color: #4499ff;
  font-size: 0.875rem;
  white-space: nowrap;
`

const HpConsume = styled.span`
  color: #ff4444;
  font-size: 0.875rem;
  white-space: nowrap;
`

const LevelTag = styled.span<{ $isNew: boolean }>`
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
  background-color: ${({ $isNew }) => ($isNew ? '#4caf50' : '#ff9800')};
  color: white;
`

export { getStaticProps } from '@/utils/staticPages'

export const getStaticPaths = getStaticPathsFor('skills')
