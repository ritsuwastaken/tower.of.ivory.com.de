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
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
