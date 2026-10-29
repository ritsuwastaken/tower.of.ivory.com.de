import { notFound } from 'next/navigation'
import SkillDetails from '@/components/SkillDetails'
import { getSkill, getStaticParams } from '@/utils/catalog'

type Props = { params: Promise<{ id: string }> }
export const dynamicParams = false
export const generateStaticParams = () => getStaticParams('skills')

export const metadata = { title: null }

export default async function Page({ params }: Props) {
  const skill = await getSkill((await params).id)
  if (!skill) notFound()
  return <SkillDetails key={skill.skill_id} skill={skill} />
}
