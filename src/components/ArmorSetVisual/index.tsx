import { ArmorSet } from '@/types/armorset'
import styled from 'styled-components'
import { ArmorSlot } from './ArmorSlot'

interface ArmorSetVisualProps {
  armorSet: ArmorSet
}

const slotTypes = [
  { type: 'head', position: 'top' },
  { type: 'hat', position: 'top-left' },
  { type: 'chest', position: 'middle' },
  { type: 'legs', position: 'middle-bottom' },
  { type: 'feet', position: 'bottom' },
  { type: 'lhand', position: 'right' },
  { type: 'cloak', position: 'top-right' },
  { type: 'rhand', position: 'left' },
  { type: 'gloves', position: 'bottom-left' },
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
