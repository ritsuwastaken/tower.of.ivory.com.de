import { ErrorPage } from '@/components/ErrorPage'

export default function Custom400() {
  return <ErrorPage status={400} description="Bad Request" />
}
