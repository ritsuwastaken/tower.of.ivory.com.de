'use client'

import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`

export const Skeleton = styled.span<{
  $width?: string
  $height?: string
  $radius?: string
}>`
  display: block;
  width: ${({ $width }) => $width || '100%'};
  max-width: 100%;
  height: ${({ $height }) => $height || '20px'};
  flex-shrink: 0;
  border-radius: ${({ $radius }) => $radius || '4px'};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.control} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.control} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
