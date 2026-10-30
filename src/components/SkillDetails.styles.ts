import styled, { css } from 'styled-components'
import { selectStyles } from '@/components/Select.styles'
import { controlStyles } from './Control.styles'

export const MobileLevelSelect = styled.div`
  display: none;
  position: relative;
  width: 100%;
  max-width: 250px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
    position: relative;
  }
`

export const SkillLevels = styled.div`
  width: 300px;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.panel};
  font-size: ${({ theme }) => theme.typography.small};

  h2 {
    font-size: ${({ theme }) => theme.typography.heading};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
`

export const LevelCard = styled.button<{ $active?: boolean }>`
  ${controlStyles}
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin: 0.5rem 0;
  border-radius: ${({ theme }) => theme.radii.control};
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.text};
  background-color: transparent;

  ${({ $active }) =>
    $active &&
    css`
      background: ${({ theme }) => theme.colors.active} !important;
      font-weight: 500;
    `}
`

export const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const LevelNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const SmallLevelDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.small};
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`

export const LevelSelect = styled.select`
  ${selectStyles}
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`

export const LevelNumber = styled.span`
  font-weight: 500;
  font-size: ${({ theme }) => theme.typography.small};
`

export const Consume = styled.span`
  color: ${({ theme }) => theme.colors.soft};
  font-size: ${({ theme }) => theme.typography.small};
  white-space: nowrap;
`

export const MpConsume = styled.span`
  color: ${({ theme }) => theme.colors.mp};
  font-size: ${({ theme }) => theme.typography.small};
  white-space: nowrap;
`

export const HpConsume = styled.span`
  color: ${({ theme }) => theme.colors.hp};
  font-size: ${({ theme }) => theme.typography.small};
  white-space: nowrap;
`

export const LevelTag = styled.span<{ $isNew: boolean }>`
  font-size: ${({ theme }) => theme.typography.caption};
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
  background-color: ${({ theme, $isNew }) => ($isNew ? theme.colors.success : theme.colors.warning)};
  color: ${({ theme }) => theme.colors.surface};
`
