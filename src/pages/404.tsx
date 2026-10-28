import { ErrorPage } from '@/components/ErrorPage'

export default function Custom404() {
  return <ErrorPage status={404} description="Page Not Found" />
}
