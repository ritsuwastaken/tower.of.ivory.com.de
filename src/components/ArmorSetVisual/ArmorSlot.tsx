import { ArmorSet } from '@/types/armorset'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

interface ArmorSlotProps {
  slot: {
    type: string
    position: string
  }
  armorSet: ArmorSet
}

export const ArmorSlot = ({ slot, armorSet }: ArmorSlotProps) => {
  const router = useRouter()
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
    <GridSlot $position={slot.position} $isEmpty={!hasItem}>
      {hasItem ? (
        <IconWrapper
          title={itemToLink?.name || ''}
          onClick={(e) => {
            e.stopPropagation()
            if (itemToLink?.object_id) {
              router.push(`/${type}/${itemToLink.object_id}`)
            }
          }}
        >
          <StyledImage
            src={`/icon/${iconToUse?.split('.').at(-1)}.webp`}
            alt={`${armorSet.name} ${slot.type}`}
            width={32}
            height={32}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                '/icon/etc_alphabet_ii_i00.webp'
            }}
          />
        </IconWrapper>
      ) : (
        <EmptySlot>{slot.type}</EmptySlot>
      )}
    </GridSlot>
  )
}

const GridSlot = styled.div<{ $position: string; $isEmpty: boolean }>`
  background-color: rgba(40, 40, 40, 0.8);
  border: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: ${(props) => (props.$isEmpty ? 0.5 : 1)};

  ${(props) => {
    switch (props.$position) {
      case 'top':
        return css`
          grid-column: 2;
          grid-row: 1;
        `
      case 'top-left':
        return css`
          grid-column: 1;
          grid-row: 1;
        `
      case 'top-right':
        return css`
          grid-column: 3;
          grid-row: 1;
        `
      case 'middle':
        return css`
          grid-column: 2;
          grid-row: 2;
        `
      case 'left':
        return css`
          grid-column: 1;
          grid-row: 2;
        `
      case 'right':
        return css`
          grid-column: 3;
          grid-row: 2;
        `
      case 'middle-bottom':
        return css`
          grid-column: 2;
          grid-row: 3;
        `
      case 'bottom-left':
        return css`
          grid-column: 1;
          grid-row: 3;
        `
      case 'bottom':
        return css`
          grid-column: 3;
          grid-row: 3;
        `
      default:
        return ''
    }
  }}
`

const IconWrapper = styled.div`
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
