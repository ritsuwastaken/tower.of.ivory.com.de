import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'

export const Icon = styled.div`
  border-radius: 8px;
  background-color: #2a2a2a;
  padding: 0.5rem;
`

export const TotalStat = styled.div`
  margin-top: 4px;
  color: #ddd;
  font-size: 0.95rem;
`

export const PartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

export const PartRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
  padding-top: 12px;
  align-items: flex-start;
  gap: 16px;
`

export const PartIconColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0.5rem;
`

export const PartIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`

export const PartDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const PartHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column !important;
    align-items: flex-start;
  }
`

export const PartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const PartMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const PartMain = styled.div`
  display: flex;
  align-items: center;
`

export const PartParams = styled.div`
  display: flex;
  flex-direction: column;
  color: #aaa;
  font-size: 0.9em;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  gap: 0.3rem;
`

export const PartParam = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const ParamLabel = styled.span`
  color: #888;
`

export const ParamValue = styled.span`
  color: #ddd;
  font-weight: 500;
`

export const PartLinks = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-self: flex-start;
    margin-top: 8px;
  }
`

export const PartIconImage = styled(Image)`
  border-radius: 4px;
  border: 2px solid #2a2a2a;
`

export const PartLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`
