import { getFlagEmoji } from '@/utils/getFlagEmoji'
import { supportedLanguages } from '@/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import styled from 'styled-components'
import { selectStyles } from '@/components/Select.styles'
import { controlStyles } from './Control.styles'

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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.panel};
`

const HeaderLeft = styled.div`
  flex: 1;
  min-width: min(100%, 12rem);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: ${({ theme }) => theme.typography.body};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`

const HeaderLink = styled(Link)`
  text-decoration: none;

  &:hover h3 {
    color: ${({ theme }) => theme.colors.secondary};
  }
`

const Description = styled.p`
  margin-top: 0.2rem;
  margin-bottom: 0;

  font-size: ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.colors.muted};
`

const LastUpdate = styled.p`
  margin-top: 0.2rem;
  margin-bottom: 0;

  font-size: ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.colors.subtle};
`

const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const LanguageSelect = styled.select`
  ${selectStyles}
  width: auto;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.active};
  }
`

const GitHubLink = styled.a`
  ${controlStyles}
  width: var(--control-height);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;

  transition: 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.active};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.active};
  }
`

const GitHubIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;
`
