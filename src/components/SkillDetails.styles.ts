import styled, { css } from 'styled-components'
import { selectStyles } from '@/components/Select.styles'

export const MobileLevelSelect = styled.div`
  display: none;
  position: relative;
  width: 100%;
  max-width: 250px;

  @media (max-width: 768px) {
    display: block;
    position: relative;
  }
`

export const SkillLevels = styled.div`
  width: 300px;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  font-size: 0.875rem;

  h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const LevelCard = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: var(--text-color);
  background-color: transparent;

  ${({ $active }) =>
    $active &&
    css`
      background: #4a4a4a !important;
      font-weight: 500;
    `}
`

export const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

export const LevelNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const SmallLevelDescription = styled.div`
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  line-height: 1.4;
`

export const LevelSelect = styled.select`
  ${selectStyles}
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  background-position: right 0.75rem center;
  background-size: 1rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`

export const LevelNumber = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`

export const Consume = styled.span`
  color: #ccc;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const MpConsume = styled.span`
  color: #90c2ff;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const HpConsume = styled.span`
  color: #ffabab;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const LevelTag = styled.span<{ $isNew: boolean }>`
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
  background-color: ${({ $isNew }) => ($isNew ? '#4caf50' : '#ff9800')};
  color: #1a1a1a;
`
