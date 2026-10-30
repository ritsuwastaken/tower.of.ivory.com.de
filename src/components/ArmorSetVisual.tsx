import type { ArmorSet } from '@/types'
import { CatalogIcon } from '@/components/CatalogImage'
import { getItemUrl } from '@/utils/getItemUrl'
import Link from 'next/link'
import styled from 'styled-components'

const slotTypes = [
  'head',
  'hat',
  'chest',
  'legs',
  'feet',
  'lhand',
  'cloak',
  'rhand',
  'gloves',
] as const

export function ArmorSetVisual({ armorSet }: { armorSet: ArmorSet }) {
  const pieces = Object.fromEntries(
    slotTypes.map(
      (type) =>
        [
          type,
          armorSet.items.find(({ body_part }) =>
            body_part?.some((part) => part.toLowerCase().includes(type)),
          ),
        ] as const,
    ),
  )

  return (
    <Grid>
      {slotTypes.map((type) => {
        const useChestIcon =
          type === 'legs' && (pieces.chest?.icon?.length ?? 0) > 2
        const piece = useChestIcon ? pieces.chest : pieces[type]
        const icon = piece?.icon?.[useChestIcon ? 2 : 0]

        return (
          <Slot key={type} $type={type}>
            {icon && piece ? (
              <SlotLink
                href={getItemUrl(piece)}
                onClick={(event) => event.stopPropagation()}
              >
                <SlotIcon icon={icon} alt={`${armorSet.name} ${type}`} />
              </SlotLink>
            ) : (
              <EmptySlot>{type}</EmptySlot>
            )}
          </Slot>
        )
      })}
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'hat head cloak'
    'rhand chest lhand'
    'gloves legs feet';
  gap: 5px;
  width: 150px;
  height: 150px;
  padding: 8px;
  margin: 0 auto;
`

const Slot = styled.div<{ $type: string }>`
  grid-area: ${({ $type }) => $type};
  background-color: ${({ theme }) => theme.colors.slot};
  border: 1px solid ${({ theme }) => theme.colors.slotBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const SlotLink = styled(Link)`
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
    filter: drop-shadow(0 0 4px ${({ theme }) => theme.colors.slotGlow});
  }
`

const SlotIcon = styled(CatalogIcon)`
  border: none;
  object-fit: contain;
`

const EmptySlot = styled.div`
  color: ${({ theme }) => theme.colors.subtle};
  font-size: ${({ theme }) => theme.typography.slot};
  text-transform: capitalize;
`
