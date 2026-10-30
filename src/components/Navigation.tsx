import { useCatalogSearchParams } from '@/components/SearchParamsBoundary'
import { useTranslation } from '@/hooks/useTranslation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styled from 'styled-components'
import { controlStyles } from './Control.styles'

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
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const TabLink = styled(Link)<{ $isActive?: boolean }>`
  ${controlStyles}
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.active : theme.colors.control)};
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.text : theme.colors.secondary)};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:focus {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.text};
  }
`
