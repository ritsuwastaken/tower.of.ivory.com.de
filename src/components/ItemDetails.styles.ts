import { CatalogImage } from '@/components/CatalogImage'
import styled from 'styled-components'

export const ArmorSets = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.panel};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.panel};
  align-self: flex-start;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-self: center;
  }

  h2 {
    margin-top: 0;
    font-size: ${({ theme }) => theme.typography.heading};
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
  font-size: ${({ theme }) => theme.typography.small};
`

export const SetInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`

export const SetInfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
`

export const SetInfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
`

export const HarborBirthdayItem = styled(CatalogImage).attrs({
  width: 256,
  height: 256,
  alt: 'Harbor Birthday 1 year',
})`
  max-height: 256px;
  max-width: 256px;
  border-radius: ${({ theme }) => theme.radii.control};
  margin-top: 8px;
`

export const SetName = styled.h3`
  margin-top: 0;
  font-size: ${({ theme }) => theme.typography.body};
  text-align: center;
  text-decoration: underline;
`
