import { ErrorPage } from '@/components/ErrorPage'

export const metadata = { title: 'Bad Request' }
export default function Page() {
  return <ErrorPage status={400} description="Bad Request" />
}
