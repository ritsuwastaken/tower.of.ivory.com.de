import { Item } from '@/types/item'
import { Skill } from '@/types/skill'
import { getOriginalObjectName } from '@/utils/getOriginalObjectName'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import styled from 'styled-components'

interface ExternalLink {
  url: string
  label: string
}

interface ExternalLinksProps {
  data: Skill | Item
}

export const ExternalLinks = ({ data }: ExternalLinksProps) => {
  const { t } = useTranslation()
  const links: ExternalLink[] = []

  if ('skill_id' in data) {
    links.push({
      url: `https://knowledgedb.elmorelab.com/#/skills/skill-info?skillId=${data.skill_id}&level=${data.skill_level}&chronicle=c1`,
      label: t('externalLinks.elmoreLab'),
    })
    if (!data.is_new) {
      links.push({
        url: `https://l2hub.info/c1/skills/${data.skill_id}:${data.skill_level}`,
        label: t('externalLinks.l2hub'),
      })
    }
  } else {
    if (!data.is_new) {
      const objectName = getOriginalObjectName(data)

      links.push({
        url: `https://l2hub.info/c1/items/${objectName
          ?.replace(/[\[\]]/g, '')
          .toLowerCase()
          .replace(/ /g, '_')}`,
        label: t('externalLinks.l2hub'),
      })
    }

    links.push({
      url: `https://knowledgedb.elmorelab.com/#/items?itemId=${data.object_id}&chronicle=c1`,
      label: t('externalLinks.elmoreLab'),
    })
  }

  return (
    <LinksContainer>
      {links.map((link, index) => (
        <StyledLink
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </StyledLink>
      ))}
    </LinksContainer>
  )
}

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const StyledLink = styled(Link)`
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
