import { ArmorSet } from '@/types/armorset'
import styled from 'styled-components'
import { ArmorSlot } from './ArmorSlot'

interface ArmorSetVisualProps {
  armorSet: ArmorSet
}

const slotTypes = [
  { type: 'head', column: 2, row: 1 },
  { type: 'hat', column: 1, row: 1 },
  { type: 'chest', column: 2, row: 2 },
  { type: 'legs', column: 2, row: 3 },
  { type: 'feet', column: 3, row: 3 },
  { type: 'lhand', column: 3, row: 2 },
  { type: 'cloak', column: 3, row: 1 },
  { type: 'rhand', column: 1, row: 2 },
  { type: 'gloves', column: 1, row: 3 },
]

export const ArmorSetVisual = ({ armorSet }: ArmorSetVisualProps) => {
  return (
    <ArmorSetGridItem>
      <GridContainer>
        {slotTypes.map((slot) => {
          return <ArmorSlot key={slot.type} slot={slot} armorSet={armorSet} />
        })}
      </GridContainer>
    </ArmorSetGridItem>
  )
}

const ArmorSetGridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  width: 150px;
  height: 150px;
  padding: 8px;
  margin: 0 auto;
`
