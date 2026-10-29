import { ErrorPage } from '@/components/ErrorPage'

export const metadata = { title: 'Internal Server Error' }
export default function Page() {
  return <ErrorPage status={500} description="Internal Server Error" />
}
