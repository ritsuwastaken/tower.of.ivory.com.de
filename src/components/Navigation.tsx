import { useCatalogSearchParams } from '@/components/SearchParamsBoundary'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'
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
}

export const Navigation = () => {
  const { t } = useTranslation()
  const pathname = usePathname() || ''
  const searchParams = useCatalogSearchParams()
  const currentType = useMemo(() => {
    if (pathname === '/') return DEFAULT_TYPE

    for (const [route, type] of Object.entries(ROUTE_MAPPING)) {
      if (pathname.startsWith(route)) return type
    }

    return ''
  }, [pathname])

  const searchValue = searchParams.get('search')
  const queryString = searchValue
    ? `?${new URLSearchParams({ search: searchValue })}`
    : ''

  return (
    <CategoryTabs>
      {navigationItems.map(({ type, path, translationKey }) => (
        <TabLink
          key={type}
          $isActive={currentType === type}
          href={`${path}${queryString}`}
          aria-current={currentType === type ? 'page' : undefined}
        >
          {t(translationKey)}
        </TabLink>
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

const TabLink = styled(Link)<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.$isActive ? '#4a4a4a' : '#2a2a2a')};
  color: ${(props) => (props.$isActive ? '#fff' : '#888')};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.833333rem;

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }

  &:hover {
    background-color: #3a3a3a;
    color: #fff;
  }
`
