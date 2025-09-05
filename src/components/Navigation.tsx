import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

const ROUTE_MAPPING = {
  '/skills': 'skills',
  '/armorsets': 'armorsets',
  '/weapons': 'weapon',
  '/armor': 'armor',
  '/etc': 'etcitem',
} as const

const DEFAULT_TYPE = 'armorsets'

const navigationItems: NavigationItem[] = [
  {
    type: 'armorsets',
    path: '/armorsets',
    translationKey: 'navigation.armorsets',
  },
  { type: 'skills', path: '/skills', translationKey: 'navigation.skills' },
  { type: 'weapon', path: '/weapons', translationKey: 'navigation.weapons' },
  { type: 'armor', path: '/armor', translationKey: 'navigation.armor' },
  {
    type: 'etcitem',
    path: '/etc',
    translationKey: 'navigation.miscellaneous',
  },
]

type NavigationItem = {
  type: string
  path: string
  translationKey: string
  disabled?: boolean
  soon?: boolean
}

export const Navigation = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname() || ''
  const searchParams = useSearchParams()
  const currentType = useMemo(() => {
    if (pathname === '/') return DEFAULT_TYPE

    for (const [route, type] of Object.entries(ROUTE_MAPPING)) {
      if (pathname.startsWith(route)) return type
    }

    return ''
  }, [pathname])

  const handleCategoryChange = useCallback(
    (type: string, path: string) => {
      const searchValue = searchParams.get('search')
      const queryString = searchValue ? `?search=${searchValue}` : ''
      router.push(`${path}${queryString}`)
    },
    [searchParams, router],
  )

  return (
    <CategoryTabs>
      {navigationItems.map(({ type, path, translationKey }) => (
        <TabButton
          key={type}
          $isActive={currentType === type}
          onClick={() => handleCategoryChange(type, path)}
        >
          {t(translationKey)}
        </TabButton>
      ))}
    </CategoryTabs>
  )
}

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`

const TabButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.$isActive ? '#4a4a4a' : '#2a2a2a')};
  color: ${(props) => (props.$isActive ? '#fff' : '#888')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }

  &:hover:not(:disabled) {
    background-color: #3a3a3a;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
