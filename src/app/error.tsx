'use client'

import { ErrorPage } from '@/components/ErrorPage'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <ErrorPage status={500} description="Internal Server Error" />
      <button onClick={reset}>Try again</button>
    </div>
  )
}
