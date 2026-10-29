'use client'

import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'
import { Skeleton } from './Skeleton'
import { DataTable } from './DataTable'
import {
  defaultArmorSetColumns,
  getArmorSetColumnLabels,
  defaultSkillColumns,
  getDefaultItemColumns,
} from './DataTable/columns'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import {
  SearchParamsBoundary,
  useCatalogSearchParams,
} from './SearchParamsBoundary'
import {
  BackButton,
  Container,
  ContentWrapper,
  Description,
  HeaderInfo,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  Label,
  MeshTextureSection,
  StatRow,
  Stats,
  TableContainer,
  Value,
} from './primitives/DetailsPrimitives'
import {
  ArmorSets,
  SetInfo,
  SetInfoItem,
  SetInfoLabel,
  SetInfoValue,
  SetName,
  SetVisualContainer,
} from './primitives/ItemDetailsLayout'
import {
  SkillLevels,
  LevelCard,
  LevelHeader,
  LevelNumberContainer,
  SmallLevelDescription,
  MobileLevelSelect,
} from './primitives/SkillDetailsLayout'
import {
  Icon,
  TotalStat,
  PartsContainer,
  PartRow,
  PartDetails,
  PartHeaderContainer,
  PartIconColumn,
  PartIcon,
  PartHeader,
  PartMainContainer,
  PartMain,
  PartParams,
  PartParam,
  PartLinks,
} from './primitives/ArmorSetDetailsLayout'

type LoadingKind =
  | 'weapons'
  | 'armor'
  | 'etc'
  | 'skills'
  | 'armorsets'
  | 'item'
  | 'skill'
  | 'armorset'
const noop = () => {}
const rows = Array.from({ length: 10 }, () => ({}))

export default function RouteLoading({
  kind = 'weapons',
}: {
  kind?: LoadingKind
}) {
  const { t } = useTranslation()
  const details = kind === 'item' || kind === 'skill' || kind === 'armorset'
  return (
    <LoadingRegion
      role="status"
      aria-label={t('meta.loading')}
      aria-busy="true"
    >
      <div aria-hidden="true" inert>
        {details ? (
          <DetailSkeleton kind={kind} />
        ) : (
          <SearchParamsBoundary>
            <ListSkeleton kind={kind} />
          </SearchParamsBoundary>
        )}
      </div>
    </LoadingRegion>
  )
}

function ListSkeleton({ kind }: { kind: LoadingKind }) {
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()
  const params = useCatalogSearchParams()
  const visibility =
    kind === 'armorsets'
      ? defaultArmorSetColumns
      : kind === 'skills'
        ? defaultSkillColumns
        : getDefaultItemColumns(
            kind === 'armor' ? 'armor' : kind === 'etc' ? 'etcitem' : 'weapon',
          )
  const labels: Record<string, string> =
    kind === 'armorsets' ? getArmorSetColumnLabels(t) : { icon: '' }
  const columns = Object.entries(visibility).map(([key, visible]) => ({
    key,
    visible,
    label: labels[key] ?? formatColumnName(key),
  }))
  return (
    <DataTable
      data={rows}
      columns={columns}
      searchTerm=""
      onSearchChange={noop}
      searchPlaceholder={t(
        kind === 'armorsets'
          ? 'armorSetsPage.searchPlaceholder'
          : kind === 'skills'
            ? 'skillsPage.searchPlaceholder'
            : 'itemsPage.searchPlaceholder',
      )}
      onSort={noop}
      sortConfig={{ column: null, direction: 'asc' }}
      columnVisibility={visibility}
      onColumnVisibilityChange={noop}
      formatColumnName={formatColumnName}
      currentPage={1}
      totalPages={1}
      onPageChange={noop}
      enableGridView={kind === 'armorsets'}
      viewMode={params.get('view') === 'grid' ? 'grid' : 'table'}
      onViewModeChange={noop}
      renderCell={(_, column) =>
        column === 'visual' ? (
          <Skeleton $width="150px" $height="150px" />
        ) : column === 'icon' ? (
          <Skeleton $width="32px" $height="32px" />
        ) : column === 'description' ? (
          <Lines />
        ) : (
          <Skeleton $width={column === 'name' ? '180px' : '80px'} />
        )
      }
    />
  )
}

function Lines() {
  return (
    <LineGroup>
      <Skeleton />
      <Skeleton />
      <Skeleton $width="75%" />
    </LineGroup>
  )
}

function LoadingStats() {
  return (
    <Stats>
      {Array.from({ length: 8 }, (_, index) => (
        <StatRow key={index}>
          <Label>
            <Skeleton $width="100px" />
          </Label>
          <Value>
            <Skeleton $width="80px" />
          </Value>
        </StatRow>
      ))}
    </Stats>
  )
}

function DetailSkeleton({ kind }: { kind: 'item' | 'skill' | 'armorset' }) {
  return (
    <Container>
      <BackButton as="span">⟵</BackButton>
      {kind === 'armorset' ? (
        <ArmorSetSkeleton />
      ) : (
        <ContentWrapper>
          <TableContainer>
            <ItemHeader>
              <HeaderLeft>
                <Skeleton $width="64px" $height="64px" $radius="8px" />
                <HeaderInfo>
                  <h1>
                    <Skeleton $width="200px" $height="32px" />
                  </h1>
                  {kind === 'skill' && (
                    <MobileLevelSelect>
                      <Skeleton $width="100px" $height="30px" />
                    </MobileLevelSelect>
                  )}
                </HeaderInfo>
              </HeaderLeft>
              <HeaderRight>
                <Skeleton $width="120px" $height="30px" />
              </HeaderRight>
            </ItemHeader>
            <Description>
              <Lines />
            </Description>
            <LoadingStats />
            <MeshTextureSection>
              <Skeleton $width="200px" $height="36px" />
            </MeshTextureSection>
            {kind === 'item' && (
              <MeshTextureSection>
                <Skeleton $width="200px" $height="36px" />
              </MeshTextureSection>
            )}
          </TableContainer>
          {kind === 'skill' ? <SkillSidebar /> : <ItemSidebar />}
        </ContentWrapper>
      )}
    </Container>
  )
}

function ItemSidebar() {
  return (
    <ArmorSets>
      <h2>
        <Skeleton $width="150px" />
      </h2>
      <div>
        <SetName>
          <Skeleton $width="180px" />
        </SetName>
        <SetVisualContainer>
          <Skeleton $width="150px" $height="150px" />
        </SetVisualContainer>
        <SetInfo>
          {Array.from({ length: 3 }, (_, index) => (
            <SetInfoItem key={index}>
              <SetInfoLabel>
                <Skeleton $width="70px" />
              </SetInfoLabel>
              <SetInfoValue>
                <Skeleton $width="50px" />
              </SetInfoValue>
            </SetInfoItem>
          ))}
        </SetInfo>
      </div>
    </ArmorSets>
  )
}

function SkillSidebar() {
  return (
    <SkillLevels>
      <h2>
        <Skeleton $width="100px" />
      </h2>
      {Array.from({ length: 5 }, (_, index) => (
        <LevelCard as="div" key={index}>
          <LevelHeader>
            <LevelNumberContainer>
              <Skeleton $width="80px" />
            </LevelNumberContainer>
            <Skeleton $width="60px" />
          </LevelHeader>
          {index % 2 === 0 && (
            <SmallLevelDescription>
              <Lines />
            </SmallLevelDescription>
          )}
        </LevelCard>
      ))}
    </SkillLevels>
  )
}

function ArmorSetSkeleton() {
  return (
    <TableContainer>
      <ItemHeader>
        <HeaderLeft>
          <Icon>
            <Skeleton $width="150px" $height="150px" />
          </Icon>
          <HeaderInfo>
            <h1>
              <Skeleton $width="200px" $height="32px" />
            </h1>
            <Skeleton $width="100px" />
            <TotalStat>
              <Skeleton $width="150px" />
            </TotalStat>
            <TotalStat>
              <Skeleton $width="180px" />
            </TotalStat>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderRight>
          <Skeleton $width="120px" $height="30px" />
        </HeaderRight>
      </ItemHeader>
      <Description>
        <Lines />
      </Description>
      <PartsContainer>
        {Array.from({ length: 4 }, (_, index) => (
          <PartRow key={index}>
            <PartDetails>
              <PartHeaderContainer>
                <PartIconColumn>
                  <PartIcon>
                    <Skeleton $width="45px" $height="45px" />
                  </PartIcon>
                </PartIconColumn>
                <PartHeader>
                  <PartMainContainer>
                    <PartMain>
                      <Skeleton $width="150px" $height="24px" />
                    </PartMain>
                    <PartParams>
                      {Array.from({ length: 3 }, (_, i) => (
                        <PartParam key={i}>
                          <Skeleton $width="120px" $height="18px" />
                        </PartParam>
                      ))}
                    </PartParams>
                  </PartMainContainer>
                  <PartLinks>
                    <Skeleton $width="120px" $height="30px" />
                  </PartLinks>
                </PartHeader>
              </PartHeaderContainer>
              {index % 2 === 0 && (
                <Description>
                  <Lines />
                </Description>
              )}
            </PartDetails>
          </PartRow>
        ))}
      </PartsContainer>
    </TableContainer>
  )
}

const LoadingRegion = styled.div`
  min-height: 70vh;
  width: 100%;
`

const LineGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-width: 160px;
`
