'use client'

import {
  Icon,
  TotalStat,
  PartsContainer,
  PartRow,
  PartIconColumn,
  PartIcon,
  PartDetails,
  PartHeaderContainer,
  PartHeader,
  PartMainContainer,
  PartMain,
  PartParams,
  PartParam,
  ParamLabel,
  ParamValue,
  PartLinks,
  PartIconImage,
  PartLink,
} from '@/components/ArmorSetDetails.styles'

import { ArmorSet } from '@/types'
import { getItemUrl } from '@/utils/getItemUrl'
import { sumProperty } from '@/utils/sumProperty'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import {
  BackButton,
  Description,
  HeaderInfo,
  HeaderLeft,
  HeaderRight,
  ItemHeader,
  TableContainer,
} from '@/components/Details.styles'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { ExternalLinks } from '@/components/ExternalLinks'

export default function ArmorSetDetails({ armorSet }: { armorSet: ArmorSet }) {
  const { t } = useTranslation()
  const router = useRouter()
  const chestPiece = armorSet.items.find(
    ({ armor_type }) => armor_type?.toLowerCase() === 'chest',
  )
  const totalPhysicalDefense = sumProperty(armorSet.items, 'physical_defense')
  const totalBasePrice = sumProperty(armorSet.items, 'base_price')

  return (
    <div>
      <BackButton
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        ⟵
      </BackButton>
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
          {armorSet.items.map((item, index) => (
            <PartRow key={index}>
              <PartDetails>
                <PartHeaderContainer>
                  <PartIconColumn>
                    {item.icon && (
                      <PartIcon>
                        <PartIconImage
                          icon={item.icon?.[0]}
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
    </div>
  )
}
