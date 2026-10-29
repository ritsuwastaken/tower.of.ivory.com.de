import { ErrorPage } from '@/components/ErrorPage'

export const metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return <ErrorPage status={404} description="Page Not Found" />
}
