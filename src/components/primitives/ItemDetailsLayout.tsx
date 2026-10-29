import { CatalogImage } from '@/components/CatalogImage'
import styled from 'styled-components'

export const ArmorSets = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    align-self: center;
  }

  h2 {
    margin-top: 0;
    font-size: 1.2rem;
    text-align: center;
  }
`

export const SetVisualContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`

export const SetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
`

export const SetInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`

export const SetInfoLabel = styled.span`
  color: var(--text-color-secondary, #666);
  font-weight: 500;
`

export const SetInfoValue = styled.span`
  color: var(--text-color, #333);
`

export const HarborBirthdayItem = styled(CatalogImage).attrs({
  width: 256,
  height: 256,
  alt: 'Harbor Birthday 1 year',
})`
  max-height: 256px;
  max-width: 256px;
  border-radius: 4px;
  margin-top: 8px;
`

export const SetName = styled.h3`
  margin-top: 0;
  font-size: 1rem;
  text-align: center;
  text-decoration: underline;
`
