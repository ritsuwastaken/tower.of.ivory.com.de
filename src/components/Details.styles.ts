import styled, { css } from 'styled-components'
import { CatalogIcon } from '@/components/CatalogImage'
import Link from 'next/link'

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.panel};
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  min-width: 0;
`

export const ItemHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
    width: 100%;
  }
`

export const HeaderLeft = styled.div`
  min-width: 0;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.sm};
    order: 1;
  }
`

export const HeaderInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    h1 {
      margin: 0;
      font-size: ${({ theme }) => theme.typography.title};
      word-break: break-word;
    }
  }
`

export const Description = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.control};
  border-radius: ${({ theme }) => theme.radii.control};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  white-space: pre-line;
  display: flex;
  flex-direction: column;
`

export const Stats = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.control};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: none;
  }
`

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`

export const Value = styled.span`
  color: ${({ theme }) => theme.colors.text};
  line-break: anywhere;
`

export const MeshTextureSection = styled.div`
  padding-top: 5px;
`

export const MeshTextureContent = styled.div`
  margin-top: 5px;
`

export const BackButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--control-height);
  min-height: var(--control-height);
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.title};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: color 0.2s ease;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem 0;
`

export const ContentWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`

export const NotificationPanel = styled.div<{ $isNew: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 10px 15px;
  border-radius: ${({ theme }) => theme.radii.control};
  font-weight: 500;
  ${({ $isNew }) =>
    $isNew
      ? css`
          background-color: ${({ theme }) => theme.colors.newBackground};
          border-left: 4px solid ${({ theme }) => theme.colors.newBorder};
          color: ${({ theme }) => theme.colors.newText};
        `
      : css`
          background-color: ${({ theme }) => theme.colors.changedBackground};
          border-left: 4px solid ${({ theme }) => theme.colors.changedBorder};
          color: ${({ theme }) => theme.colors.changedText};
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
  border-radius: ${({ theme }) => theme.radii.panel};
  background-color: ${({ theme }) => theme.colors.control};
  padding: ${({ theme }) => theme.spacing.sm};
`

export const ChangedTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  font-size: ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.colors.error};
  font-weight: bold;
`

export const CollapseButton = styled.button`
  min-height: var(--control-height);
  background: none;
  border: none;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  padding: 8px 0;
  text-align: left;
  width: 100%;
  color: ${({ theme }) => theme.colors.subtle};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.body};
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
    color: ${({ theme }) => theme.colors.soft};
  }
`

export const ChangeArrow = styled.span<{ $increased: boolean }>`
  color: ${({ theme, $increased }) => ($increased ? theme.colors.success : theme.colors.danger)};
  font-weight: bold;
`
