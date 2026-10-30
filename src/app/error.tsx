'use client'

import { ErrorPage } from '@/components/ErrorPage'
import { controlStyles } from '@/components/Control.styles'
import styled from 'styled-components'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <ErrorPage status={500} description="Internal Server Error" />
      <RetryButton onClick={reset}>Try again</RetryButton>
    </div>
  )
}

const RetryButton = styled.button`
  ${controlStyles}
  cursor: pointer;
`
