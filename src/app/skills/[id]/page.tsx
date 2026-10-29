import { notFound } from 'next/navigation'
import SkillDetails from '@/components/SkillDetails'
import { SearchParamsBoundary } from '@/components/SearchParamsBoundary'
import { getSkill, getStaticParams } from '@/utils/catalog'

type Props = { params: Promise<{ id: string }> }
export const dynamicParams = false
export const generateStaticParams = () => getStaticParams('skills')

export async function generateMetadata({ params }: Props) {
  const data = await getSkill((await params).id)
  return {
    title: data
      ? `${data.name || 'Skill'} · Lvl. ${data.skill_level ?? 1} · Skills`
      : 'Skills',
  }
}

export default async function Page({ params }: Props) {
  const skill = await getSkill((await params).id)
  if (!skill) notFound()
  return (
    <SearchParamsBoundary>
      <SkillDetails key={skill.skill_id} skill={skill} />
    </SearchParamsBoundary>
  )
}
