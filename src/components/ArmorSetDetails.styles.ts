import styled from 'styled-components'
import { CatalogIcon } from '@/components/CatalogImage'
import Link from 'next/link'
import { HeaderLeft } from './Details.styles'

export const SetHeader = styled(HeaderLeft)`
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`

export const Icon = styled.div`
  border-radius: ${({ theme }) => theme.radii.panel};
  background-color: ${({ theme }) => theme.colors.control};
  padding: ${({ theme }) => theme.spacing.sm};
`

export const TotalStat = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.strong};
  font-size: ${({ theme }) => theme.typography.body};
`

export const PartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export const PartRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  padding-bottom: 12px;
  padding-top: 12px;
  align-items: flex-start;
  gap: 16px;
`

export const PartIconColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-column: 1;
    grid-row: 2;
  }
`

export const PartIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`

export const PartDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PartHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    row-gap: ${({ theme }) => theme.spacing.md};
  }
`

export const PartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: contents;
  }
`

export const PartMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-column: 2;
    grid-row: 2;
  }
`

export const PartMain = styled.div`
  display: flex;
  align-items: center;
  overflow-wrap: anywhere;
`

export const PartParams = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.small};
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  gap: 0.3rem;
`

export const PartParam = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
`

export const ParamLabel = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`

export const ParamValue = styled.span`
  color: ${({ theme }) => theme.colors.strong};
  font-weight: 500;
`

export const PartLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    grid-row: 1;
    align-self: flex-start;
    width: 100%;
  }
`

export const PartIconImage = styled(CatalogIcon)`
  border-radius: ${({ theme }) => theme.radii.control};
  border: 2px solid ${({ theme }) => theme.colors.control};
`

export const PartLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`
