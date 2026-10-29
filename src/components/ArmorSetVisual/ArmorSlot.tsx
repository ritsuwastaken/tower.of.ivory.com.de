import { ArmorSet } from '@/types'
import { useDataUrl } from '@/hooks/useDataUrl'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

interface ArmorSlotProps {
  slot: {
    type: string
    column: number
    row: number
  }
  armorSet: ArmorSet
}

export const ArmorSlot = ({ slot, armorSet }: ArmorSlotProps) => {
  const getDataUrl = useDataUrl()
  const armorPiece = armorSet.items?.find((piece) =>
    piece.body_part?.some((part: string) =>
      part.toLowerCase().includes(slot.type.toLowerCase()),
    ),
  )

  const chestPiece = armorSet.items?.find((piece) =>
    piece.body_part?.some((part: string) =>
      part.toLowerCase().includes('chest'),
    ),
  )

  let iconToUse = armorPiece?.icon?.[0]
  let itemToLink = armorPiece

  if (slot.type === 'legs' && chestPiece?.icon && chestPiece.icon.length > 2) {
    iconToUse = chestPiece.icon[2]
    itemToLink = chestPiece
  }

  const hasItem = !!iconToUse
  const type = armorPiece?.body_part?.includes('lhand') ? 'weapons' : 'armor'

  return (
    <GridSlot $column={slot.column} $row={slot.row} $isEmpty={!hasItem}>
      {hasItem ? (
        <IconWrapper
          rel="canonical"
          href={`/${type}/${itemToLink?.object_id}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <StyledImage
            src={getDataUrl(`/icon/${iconToUse?.split('.').at(-1)}.webp`)}
            alt={`${armorSet.name} ${slot.type}`}
            width={32}
            height={32}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = getDataUrl(
                '/icon/etc_alphabet_ii_i00.webp',
              )
            }}
          />
        </IconWrapper>
      ) : (
        <EmptySlot>{slot.type}</EmptySlot>
      )}
    </GridSlot>
  )
}

const GridSlot = styled.div<{
  $column: number
  $row: number
  $isEmpty: boolean
}>`
  background-color: rgba(40, 40, 40, 0.8);
  border: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: ${(props) => (props.$isEmpty ? 0.5 : 1)};

  grid-column: ${(props) => props.$column};
  grid-row: ${(props) => props.$row};
`

const IconWrapper = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover img {
    filter: drop-shadow(0 0 4px rgba(128, 128, 128, 0.8));
  }
`

const StyledImage = styled(Image)`
  object-fit: contain;
`

const EmptySlot = styled.div`
  color: #666;
  font-size: 10px;
  text-transform: capitalize;
  opacity: 0.75;
`
