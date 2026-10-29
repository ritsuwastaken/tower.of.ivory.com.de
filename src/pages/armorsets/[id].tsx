import { getStaticPathsFor } from '@/utils/staticPages'
import { ArmorSet } from '@/types'
import { useDataUrl } from '@/hooks/useDataUrl'
import { getItemUrl } from '@/utils/getItemUrl'
import { getTotalBasePrice, getTotalPhysicalDefense } from '@/utils/getTotalX'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  BackButton,
  Container,
  Description,
  ErrorText,
  HeaderInfo,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  TableContainer,
} from '@/components/primitives/DetailsPrimitives'
import { Head } from '@/components/Head'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'
import Link from 'next/link'
import { Skeleton } from '@/components/Skeleton'

const ArmorSetPageLoading = () => {
  return (
    <TableContainer>
      <ItemHeader>
        <HeaderLeft>
          <Icon>
            <Skeleton width={150} height={150} />
          </Icon>
          <HeaderInfo>
            <h1>
              <Skeleton width={200} height={32} />
            </h1>
            <div>
              <Skeleton width={100} height={20} />
            </div>
            <TotalStat>
              <Skeleton width={150} height={20} />
            </TotalStat>
            <TotalStat>
              <Skeleton width={180} height={20} />
            </TotalStat>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderRight>
          <Skeleton width={120} height={30} />
        </HeaderRight>
      </ItemHeader>

      <Description>
        <Skeleton count={2} />
      </Description>

      <PartsContainer>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <PartRow key={index}>
              <PartDetails>
                <PartHeaderContainer>
                  <PartIconColumn>
                    <PartIcon>
                      <Skeleton borderRadius={4} width={45} height={45} />
                    </PartIcon>
                  </PartIconColumn>
                  <PartHeader>
                    <PartMainContainer>
                      <PartMain>
                        <Skeleton width={150} height={24} />
                      </PartMain>
                      <PartParams>
                        <PartParam>
                          <Skeleton width={120} height={18} />
                        </PartParam>
                        <PartParam>
                          <Skeleton width={80} height={18} />
                        </PartParam>
                        <PartParam>
                          <Skeleton width={100} height={18} />
                        </PartParam>
                      </PartParams>
                    </PartMainContainer>
                    <PartLinks>
                      <Skeleton width={80} height={24} />
                    </PartLinks>
                  </PartHeader>
                </PartHeaderContainer>
                {index % 2 === 0 && (
                  <Description>
                    <Skeleton count={1} />
                  </Description>
                )}
              </PartDetails>
            </PartRow>
          ))}
      </PartsContainer>
    </TableContainer>
  )
}

export default function ArmorSetPage() {
  const getDataUrl = useDataUrl()
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const {
    data: armorSet,
    isLoading,
    isError,
  } = useQuery<ArmorSet, Error>({
    queryKey: ['armorSet', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(getDataUrl('/data/armorsets.json'))
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

  if (!id) return null

  return (
    <Container>
      <Head
        description={
          isLoading
            ? t('meta.loading')
            : isError
              ? t('meta.armorSetNotFound')
              : armorSet?.name
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
        <ArmorSetPageLoading />
      ) : isError ? (
        <TableContainer>
          <ErrorText>{t('armorSetDetails.notFound')}</ErrorText>
        </TableContainer>
      ) : (
        renderDetails()
      )}
    </Container>
  )

  function renderDetails() {
    if (!armorSet) return null
    return (
      <TableContainer>
        <ItemHeader>
          <HeaderLeft>
            <Icon>
              <ArmorSetVisual armorSet={armorSet} />
            </Icon>
            <HeaderInfo>
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
                <TotalStat>
                  {t('armorSetDetails.totalPDef')}:{' '}
                  <strong>{totalPhysicalDefense}</strong>
                </TotalStat>
              )}
              {totalBasePrice > 0 && (
                <TotalStat>
                  {t('armorSetDetails.basePrice')}:{' '}
                  <strong>{totalBasePrice.toLocaleString()}</strong>
                </TotalStat>
              )}
            </HeaderInfo>
          </HeaderLeft>
          <HeaderRight>
            {!!chestPiece && <ExternalLinks data={chestPiece} />}
          </HeaderRight>
        </ItemHeader>

        {armorSet.set_bonus && (
          <Description>
            <strong>{t('armorSetsPage.setBonus')}:</strong> {armorSet.set_bonus}
          </Description>
        )}

        <PartsContainer>
          {armorSet.items &&
            armorSet.items.map((item, index) => (
              <PartRow key={index}>
                <PartDetails>
                  <PartHeaderContainer>
                    <PartIconColumn>
                      {item.icon && (
                        <PartIcon>
                          <PartIconImage
                            src={getDataUrl(
                              `/icon/${item?.icon?.[0]?.split('.')[1]}.webp`,
                            )}
                            alt={
                              item.name ||
                              `${t('armorSetDetails.unnamedItem')} ${item.object_id}`
                            }
                            width={45}
                            height={45}
                          />
                        </PartIcon>
                      )}
                    </PartIconColumn>
                    <PartHeader>
                      <PartMainContainer>
                        <PartMain>
                          <PartLink href={getItemUrl(item)}>
                            <span>{item.name}</span>
                          </PartLink>
                        </PartMain>
                        <PartParams>
                          {item.body_part && (
                            <PartParam>
                              <ParamLabel>
                                {t('armorSetDetails.part')}:
                              </ParamLabel>
                              <ParamValue>
                                {item.body_part
                                  .map((part) => {
                                    const words = part.toLowerCase().split(' ')
                                    words[0] =
                                      words[0].charAt(0).toUpperCase() +
                                      words[0].slice(1)
                                    return words.join(' ')
                                  })
                                  .join(', ')}
                              </ParamValue>
                            </PartParam>
                          )}
                          {item.physical_defense && (
                            <PartParam>
                              <ParamLabel>
                                {t('armorSetDetails.pDef')}:
                              </ParamLabel>
                              <ParamValue>{item.physical_defense}</ParamValue>
                            </PartParam>
                          )}
                          {item.base_price && (
                            <PartParam>
                              <ParamLabel>
                                {t('armorSetDetails.basePrice')}:
                              </ParamLabel>
                              <ParamValue>
                                {item.base_price.toLocaleString()}
                              </ParamValue>
                            </PartParam>
                          )}
                          {!!item.crystal_count && (
                            <PartParam>
                              <ParamLabel>
                                {t('armorSetDetails.crystalCount')}:
                              </ParamLabel>
                              <ParamValue>{item.crystal_count}</ParamValue>
                            </PartParam>
                          )}
                        </PartParams>
                      </PartMainContainer>
                      <PartLinks>
                        <ExternalLinks data={item} />
                      </PartLinks>
                    </PartHeader>
                  </PartHeaderContainer>
                  {item.description && (
                    <Description>
                      {item.description.replace(/\\n/g, '\n')}
                    </Description>
                  )}
                </PartDetails>
              </PartRow>
            ))}
        </PartsContainer>
      </TableContainer>
    )
  }
}

const Icon = styled.div`
  border-radius: 8px;
  background-color: #2a2a2a;
  padding: 0.5rem;
`

const TotalStat = styled.div`
  margin-top: 4px;
  color: #ddd;
  font-size: 0.95rem;
`

const PartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

const PartRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
  padding-top: 12px;
  align-items: flex-start;
  gap: 16px;
`

const PartIconColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0.5rem;
`

const PartIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`

const PartDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PartHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column !important;
    align-items: flex-start;
  }
`

const PartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const PartMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const PartMain = styled.div`
  display: flex;
  align-items: center;
`

const PartParams = styled.div`
  display: flex;
  flex-direction: column;
  color: #aaa;
  font-size: 0.9em;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  gap: 0.3rem;
`

const PartParam = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const ParamLabel = styled.span`
  color: #888;
`

const ParamValue = styled.span`
  color: #ddd;
  font-weight: 500;
`

const PartLinks = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-self: flex-start;
    margin-top: 8px;
  }
`

const PartIconImage = styled(Image)`
  border-radius: 4px;
  border: 2px solid #2a2a2a;
`

const PartLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`

export { getStaticProps } from '@/utils/staticPages'

export const getStaticPaths = getStaticPathsFor('armorsets')
