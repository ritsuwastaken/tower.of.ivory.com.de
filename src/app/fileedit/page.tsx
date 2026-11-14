import FileEditPage from '@/components/FileEditPage'
import { definitionNames } from '@/utils/definitions'

export const metadata = { title: 'File Edit' }

export default function Page() {
  return <FileEditPage definitionNames={definitionNames()} />
}
