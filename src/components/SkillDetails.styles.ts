import styled, { css } from 'styled-components'

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
  appearance: none;
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  background-color: #2a2a2a;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #fff;
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
  color: #4a4a4a;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const MpConsume = styled.span`
  color: #4499ff;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const HpConsume = styled.span`
  color: #ff4444;
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
  color: white;
`
