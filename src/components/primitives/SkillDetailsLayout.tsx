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

export const LevelDropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease;
  &:hover {
    background: #333;
  }
`

export const DropdownArrow = styled.span`
  font-size: 0.75rem;
  transition: transform 0.2s ease;
`

export const MobileDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  margin-top: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

export const MobileDropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid #333;
  color: #ddd;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #333;
  }
  ${({ $active }) =>
    $active &&
    css`
      background: #444 !important;
      color: #fff;
      font-weight: 500;
    `}
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
