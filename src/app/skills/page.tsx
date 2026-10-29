import SkillsPage from '@/components/SkillsPage'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getSkills } from '@/utils/catalog'

export const metadata = { title: 'Skills' }

export default async function Page() {
  const data = await getSkills()
  return (
    <SearchParamsBoundary>
      <SkillsPage skills={data} />
    </SearchParamsBoundary>
  )
}
