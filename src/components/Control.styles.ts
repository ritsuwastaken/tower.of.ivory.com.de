import { css } from 'styled-components'

export const controlStyles = css`
  min-height: var(--control-height);
  padding: ${({ theme }) => theme.controls.padding};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background-color: ${({ theme }) => theme.colors.control};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.headingLineHeight};
`
