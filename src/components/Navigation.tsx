import { useCatalogSearchParams } from '@/components/SearchParamsBoundary'
import { useTranslation } from '@/hooks/useTranslation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styled from 'styled-components'

const navigationItems = [
  {
    path: '/armorsets',
    translationKey: 'navigation.armorsets',
  },
  { path: '/skills', translationKey: 'navigation.skills' },
  { path: '/weapons', translationKey: 'navigation.weapons' },
  { path: '/armor', translationKey: 'navigation.armor' },
  {
    path: '/etc',
    translationKey: 'navigation.miscellaneous',
  },
]

export const Navigation = () => {
  const { t } = useTranslation()
  const pathname = usePathname() || ''
  const searchParams = useCatalogSearchParams()
  const currentPath = pathname === '/' ? navigationItems[0].path : pathname
  const activePath = navigationItems.find(
    ({ path }) => currentPath === path || currentPath.startsWith(`${path}/`),
  )?.path

  const searchValue = searchParams.get('search')
  const queryString = searchValue
    ? `?${new URLSearchParams({ search: searchValue })}`
    : ''

  return (
    <CategoryTabs>
      {navigationItems.map(({ path, translationKey }) => (
        <TabLink
          key={path}
          $isActive={activePath === path}
          href={`${path}${queryString}`}
          aria-current={activePath === path ? 'page' : undefined}
        >
          {t(translationKey)}
        </TabLink>
      ))}
    </CategoryTabs>
  )
}

const CategoryTabs = styled.nav`
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
  color: ${(props) => (props.$isActive ? '#fff' : '#aaa')};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.833333rem;

  &:focus {
    outline: none;
    background-color: #3a3a3a;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  &:hover {
    background-color: #3a3a3a;
    color: #fff;
  }
`
