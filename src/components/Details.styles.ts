import styled, { css } from 'styled-components'
import { CatalogIcon } from '@/components/CatalogImage'
import Link from 'next/link'

export const TableContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  min-width: 0;
`

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
`

export const HeaderLeft = styled.div`
  min-width: 0;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
    order: 1;
  }
`

export const HeaderInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    h1 {
      margin: 0;
      font-size: 1.5rem;
      word-break: break-word;
    }
  }
`

export const Description = styled.div`
  color: #aaa;
  font-style: italic;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 1rem;
  white-space: pre-line;
  display: flex;
  flex-direction: column;
`

export const Stats = styled.div`
  display: grid;
  gap: 0.5rem;
`

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: 0.5rem;
  border-bottom: 1px solid #2a2a2a;

  @media (max-width: 768px) {
    grid-template-columns: none;
  }
`

export const Label = styled.span`
  color: #888;
`

export const Value = styled.span`
  color: #fff;
  line-break: anywhere;
`

export const MeshTextureSection = styled.div`
  padding-top: 5px;
`

export const MeshTextureContent = styled.div`
  margin-top: 5px;
`

export const BackButton = styled.a`
  display: inline-block;
  color: #888;
  text-decoration: none;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`

export const ErrorText = styled.div`
  color: #ff6b6b;
  padding: 1rem 0;
`

export const ContentWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const NotificationPanel = styled.div<{ $isNew: boolean }>`
  margin-bottom: 1rem;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
  ${({ $isNew }) =>
    $isNew
      ? css`
          background-color: rgba(0, 128, 0, 0.15);
          border-left: 4px solid #008000;
          color: #81c784;
        `
      : css`
          background-color: rgba(255, 165, 0, 0.15);
          border-left: 4px solid #ffa500;
          color: #ffb74d;
        `}
`

export const NotificationLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
`

export const DetailIcon = styled(CatalogIcon)`
  border: none;
  border-radius: 8px;
  background-color: #2a2a2a;
  padding: 0.5rem;
`

export const ChangedTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  font-size: 0.8rem;
  color: #ff6b6b;
  font-weight: bold;
`

export const CollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  text-align: left;
  width: 100%;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  &::-webkit-details-marker {
    display: none;
  }

  details > &::before {
    content: '+';
  }

  details[open] > &::before {
    content: '−';
  }

  &:hover {
    color: #ccc;
  }
`

export const ChangeArrow = styled.span<{ $increased: boolean }>`
  color: ${({ $increased }) => ($increased ? '#4caf50' : '#f44336')};
  font-weight: bold;
`
