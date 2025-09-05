import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { getFlagEmoji } from '@/utils/getFlagEmoji'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styled from 'styled-components'

export const Header = () => {
  const { t, i18n } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const availableLanguages = ['en', 'es', 'pt', 'ru', 'de']
  const languages = availableLanguages.map((code) => ({
    code,
    label: code.toLowerCase(),
    flag: getFlagEmoji(code),
  }))

  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const currentLanguage = languages.find((lang) => lang.code === i18n.language)

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <HeaderWrapper>
      <HeaderLeft>
        <HeaderLink rel="canonical" href="/armorsets">
          <h3 translate="no">Tower of Ivory</h3>
          <p>{t('header.description')}</p>
        </HeaderLink>
      </HeaderLeft>
      <HeaderRight>        
        <LanguageSelector ref={dropdownRef}>
          <LanguageButton onClick={() => setIsOpen(!isOpen)}>
            <span>{currentLanguage?.label}</span>
          </LanguageButton>

          {isOpen && (
            <LanguageDropdown>
              {languages.map((lang) => (
                <LanguageOption
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  $isActive={lang.code === i18n.language}
                >
                  <LanguageFlag>{lang.flag}</LanguageFlag>
                  <span>{lang.label}</span>
                </LanguageOption>
              ))}
            </LanguageDropdown>
          )}
        </LanguageSelector>
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
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </GitHubIcon>
        </GitHubLink>
      </HeaderRight>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
`

const HeaderLeft = styled.div`
  h3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
  }
`

const HeaderLink = styled(Link).attrs({
  tabIndex: -1,
})`
  p {
    margin-top: 0.2rem;
    font-size: 0.7rem;
    color: #888;
  }

  &:hover h3 {
    color: #7a7a7a;
  }

  &:focus {
    outline: none;
  }
`

const HeaderRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  align-items: center;
`

const LanguageSelector = styled.div`
  position: relative;
`

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #1a1a1a;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a4a4a;
  }

  &:focus {
    outline: none;
    background-color: #4a4a4a;
  }
`

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.3rem;
  background-color: #1a1a1a;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`

const LanguageOption = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.$isActive ? '#7a7a7a' : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? '500' : 'normal')};
  border: none;
  width: 100%;
  text-align: left;
  color: inherit;

  &:hover {
    background-color: #4a4a4a;
  }
`

const LanguageFlag = styled.span`
  font-size: 1.1rem;
  margin-right: 0.5rem;
`

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #888;
  text-decoration: none;

  &:hover {
    background-color: #4a4a4a;
    color: #fff;
  }

  &:focus {
    outline: none;
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
