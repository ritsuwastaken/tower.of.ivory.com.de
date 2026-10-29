import { Item, Skill } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import styled from 'styled-components'

export const ExternalLinks = ({ data }: { data: Skill | Item }) => {
  const { t } = useTranslation()
  const isSkill = 'skill_id' in data
  const elmoreLabLink = (
    <StyledLink
      href={
        isSkill
          ? `https://knowledgedb.elmorelab.com/#/skills/skill-info?skillId=${data.skill_id}&level=${data.skill_level}&chronicle=c1`
          : `https://knowledgedb.elmorelab.com/#/items?itemId=${data.object_id}&chronicle=c1`
      }
    >
      {t('externalLinks.elmoreLab')}
    </StyledLink>
  )
  const l2hubLink = !data.is_new && (
    <StyledLink
      href={
        isSkill
          ? `https://l2hub.info/c1/skills/${data.skill_id}:${data.skill_level}`
          : `https://l2hub.info/c1/items/${(
              (data.is_changed && data.changes?.object_name?.old) ||
              data.object_name
            )
              .replace(/[\[\]]/g, '')
              .toLowerCase()
              .replace(/ /g, '_')}`
      }
    >
      {t('externalLinks.l2hub')}
    </StyledLink>
  )

  return (
    <LinksContainer>
      {isSkill && elmoreLabLink}
      {l2hubLink}
      {!isSkill && elmoreLabLink}
    </LinksContainer>
  )
}

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const StyledLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  color: #888;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  outline: none;

  &:hover,
  &:focus {
    background-color: #3a3a3a;
    color: #aaa;
  }
`
