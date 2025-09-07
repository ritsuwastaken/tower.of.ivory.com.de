import styled from 'styled-components'

export const Container = styled.div``

export const TableContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  min-width: 0;

  .notificationPanel {
    margin-bottom: 1rem;
    padding: 10px 15px;
    border-radius: 4px;
    font-weight: 500;
  }

  .newItem {
    background-color: rgba(0, 128, 0, 0.15);
    border-left: 4px solid #008000;
    color: #006400;
  }

  .changedItem {
    background-color: rgba(255, 165, 0, 0.15);
    border-left: 4px solid #ffa500;
    color: #8b4513;
  }

  .notificationLink {
    color: inherit;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
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
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    border-radius: 8px;
    background-color: #2a2a2a;
    padding: 0.5rem;
  }
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
  color: #888;
  font-style: italic;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 1rem;
  white-space: pre-line;
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

  .changedTag {
    display: inline-block;
    margin-left: 8px;
    font-size: 0.8rem;
    color: #ff6b6b;
    font-weight: bold;
  }
`

export const MeshTextureSection = styled.div`
  padding-top: 5px;

  .collapseButton {
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
  }

  .collapseButton:hover {
    color: #ccc;
  }
`

export const MeshTextureContent = styled.div`
  margin-top: 5px;

  .increased {
    color: #4caf50;
    font-weight: bold;
  }

  .decreased {
    color: #f44336;
    font-weight: bold;
  }
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
