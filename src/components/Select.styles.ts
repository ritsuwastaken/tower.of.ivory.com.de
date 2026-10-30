import { css } from 'styled-components'
import { controlStyles } from './Control.styles'

export const selectStyles = css`
  ${controlStyles}
  appearance: none;
  width: 100%;
  height: var(--control-height);
  padding-right: 2.25rem;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;

  @media (pointer: coarse) {
    font-size: ${({ theme }) => theme.controls.touchFontSize};
  }
`
