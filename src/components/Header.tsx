import { getFlagEmoji } from '@/utils/getFlagEmoji'
import { supportedLanguages } from '@/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import styled from 'styled-components'
import { selectStyles } from '@/components/Select.styles'

export const Header = () => {
  const { t, i18n, language } = useTranslation()
  const lastUpdateDate = process.env.NEXT_PUBLIC_LAST_UPDATE
    ? new Date(Number(process.env.NEXT_PUBLIC_LAST_UPDATE)).toLocaleString(
        language,
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null

  return (
    <HeaderWrapper>
      <HeaderLeft>
        <HeaderLink href="/armorsets">
          <h3 translate="no">Tower of Ivory</h3>

          <Description>{t('header.description')}</Description>

          {lastUpdateDate && (
            <LastUpdate>
              {t('header.lastUpdate')}: {lastUpdateDate}
            </LastUpdate>
          )}
        </HeaderLink>
      </HeaderLeft>
      <HeaderRight>
        <LanguageSelect
          aria-label={t('header.language')}
          translate="no"
          value={language}
          onChange={(event) => void i18n.changeLanguage(event.target.value)}
        >
          {supportedLanguages.map((code) => (
            <option key={code} value={code} lang={code}>
              {getFlagEmoji(code)} {code}
            </option>
          ))}
        </LanguageSelect>
        <GitHubLink
          href="https://github.com/ritsuwastaken/tower.of.ivory.com.de"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
        >
          <GitHubIcon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </GitHubIcon>
        </GitHubLink>
      </HeaderRight>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;

  background-color: #1a1a1a;
  color: #fff;
  border-radius: 8px;
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
  }
`

const HeaderLink = styled(Link)`
  text-decoration: none;

  &:hover h3 {
    color: #aaa;
  }
`

const Description = styled.p`
  margin-top: 0.2rem;
  margin-bottom: 0;

  font-size: 0.7rem;
  color: #888;
`

const LastUpdate = styled.p`
  margin-top: 0.2rem;
  margin-bottom: 0;

  font-size: 0.65rem;
  color: #999;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const LanguageSelect = styled.select`
  ${selectStyles}
  width: auto;
  padding: 0.5rem 1.75rem 0.5rem 0.6rem;
  border: none;
  background-color: #1a1a1a;
  background-size: 0.75rem;
  color: inherit;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover,
  &:focus {
    background-color: #4a4a4a;
  }
`

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.5rem;

  border-radius: 4px;

  color: #888;
  text-decoration: none;

  transition: 0.2s;

  &:hover {
    color: #fff;
    background-color: #4a4a4a;
  }

  &:focus {
    box-shadow: 0 0 0 2px #4a4a4a;
  }
`

const GitHubIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;
`
