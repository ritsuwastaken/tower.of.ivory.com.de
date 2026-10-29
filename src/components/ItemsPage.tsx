'use client'

import { sortData, paginateData } from '@/utils/pagination'
import { DataTable, useDataTable } from '@/components/DataTable'
import { Item } from '@/types'
import { CatalogIcon } from './CatalogImage'
import {
  getFilterOptions,
  matchesChangeFilter,
  type ChangeFilter,
} from '@/utils/filters'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCatalogSearchParams } from '@/components/SearchParamsBoundary'
import { useState } from 'react'
import { getDefaultItemColumns } from './DataTable/columns'

const urlMap: Record<'weapon' | 'armor' | 'etcitem', string> = {
  weapon: 'weapons',
  armor: 'armor',
  etcitem: 'etc',
}

export const ItemsPage = ({
  type,
  items,
}: {
  type: 'weapon' | 'armor' | 'etcitem'
  items: Item[]
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useCatalogSearchParams()

  const { tableProps, deferredSearchTerm, itemsPerPage } = useDataTable<Item>({
    itemsPerPage: 50,
    defaultColumnVisibility: getDefaultItemColumns(type),
    onResetFilters: () => {
      setCrystalType('')
      setBodyPart('')
      setArmorType('')
      setWeaponType('')
      setChangeFilter('all')
    },
  })

  const crystalTypeFromParams = searchParams.get('crystal') || ''
  const bodyPartFromParams = searchParams.get('bodyPart') || ''
  const armorTypeFromParams = searchParams.get('armorType') || ''
  const weaponTypeFromParams = searchParams.get('weaponType') || ''

  const [changeFilter, setChangeFilter] = useState<ChangeFilter>(
    searchParams.get('new') === 'true'
      ? 'new'
      : searchParams.get('changed') === 'true'
        ? 'changed'
        : 'all',
  )

  const [crystalType, setCrystalType] = useState(crystalTypeFromParams)
  const [bodyPart, setBodyPart] = useState(bodyPartFromParams)
  const [armorType, setArmorType] = useState(armorTypeFromParams)
  const [weaponType, setWeaponType] = useState(weaponTypeFromParams)

  const filteredItems = items.filter((item) => {
    const matchesSearch = (item.name || item.object_name)
      .toLowerCase()
      .includes(deferredSearchTerm.toLowerCase())

    const matchesCrystalType =
      !crystalType ||
      (crystalType === 'None'
        ? !item.crystal_type || item.crystal_type.toLowerCase() === 'none'
        : item.crystal_type?.toLowerCase() === crystalType.toLowerCase())

    const matchesBodyPart =
      !bodyPart ||
      (item.body_part && item.body_part.includes(bodyPart.toLowerCase()))
    const matchesArmorType =
      !armorType ||
      (item.armor_type &&
        item.armor_type.toLowerCase() === armorType.toLowerCase())
    const matchesWeaponType =
      !weaponType ||
      (item.weapon_type &&
        item.weapon_type.toLowerCase() === weaponType.toLowerCase())

    return (
      matchesSearch &&
      matchesCrystalType &&
      matchesBodyPart &&
      matchesArmorType &&
      matchesWeaponType &&
      matchesChangeFilter(item, changeFilter)
    )
  })

  const { data: currentItems, totalPages } = paginateData(
    sortData(filteredItems, tableProps.sortConfig, 'crystal_type'),
    tableProps.currentPage,
    itemsPerPage,
  )

  const formatCrystalType = (type: string | undefined): string => {
    if (!type) return '-'
    return type.toLowerCase() === 'none'
      ? t('filters.gradeNone')
      : type.toUpperCase()
  }

  const renderCell = (item: Item, column: string) => {
    switch (column) {
      case 'name':
        return (
          <Link
            rel="canonical"
            href={`/${urlMap[type]}/${item.object_id}`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {item.name || item.object_name}
          </Link>
        )
      case 'icon':
        return (
          <CatalogIcon
            icon={item.icon?.[0]}
            alt={item.name || item.object_name}
          />
        )
      case 'crystal_type':
        return formatCrystalType(item.crystal_type)
      case 'description':
        return item.description?.replace(/\\n/g, '\n') || '-'
      case 'base_price':
        return item.base_price?.toLocaleString() || '-'
      default:
        return Array.isArray(item[column as keyof Item])
          ? (item[column as keyof Item] as string[]).join(', ')
          : item[column as keyof Item]?.toString() || '-'
    }
  }

  const allLabel = t('filters.all')
  const optionalFilters = [
    {
      id: 'body-part',
      label: t('filters.bodyPart'),
      value: bodyPart,
      onChange: setBodyPart,
      options: getFilterOptions(
        items.flatMap((item) => item.body_part),
        allLabel,
      ),
      enabled: true,
    },
    {
      id: 'armor-type',
      label: t('filters.armorType'),
      value: armorType,
      onChange: setArmorType,
      options: getFilterOptions(
        items.map((item) => item.armor_type),
        allLabel,
      ),
      enabled: type === 'armor',
    },
    {
      id: 'weapon-type',
      label: t('filters.weaponType'),
      value: weaponType,
      onChange: setWeaponType,
      options: getFilterOptions(
        items.map((item) => item.weapon_type),
        allLabel,
      ),
      enabled: type === 'weapon',
    },
  ]
  const filters = [
    {
      id: 'crystal-type',
      label: t('filters.grade'),
      value: crystalType,
      onChange: setCrystalType,
      options: [
        { value: '', label: allLabel },
        { value: 'None', label: t('filters.gradeNone') },
        ...['D', 'C', 'B', 'A', 'S'].map((value) => ({ value, label: value })),
      ],
    },
    ...optionalFilters.filter(
      (filter) => filter.enabled && filter.options.length > 1,
    ),
  ]

  const checkboxFilters = (['new', 'changed'] as const).map((value) => ({
    id: `${value}-items`,
    label: t(
      value === 'new' ? 'filters.onlyNewItems' : 'filters.onlyChangedItems',
    ),
    checked: changeFilter === value,
    onChange: () =>
      setChangeFilter((previous) => (previous === value ? 'all' : value)),
  }))

  return (
    <DataTable
      {...tableProps}
      totalPages={totalPages}
      data={currentItems}
      searchPlaceholder={t('itemsPage.searchPlaceholder')}
      onRowClick={(item) => router.push(`/${urlMap[type]}/${item.object_id}`)}
      renderCell={renderCell}
      filters={filters}
      checkboxFilters={checkboxFilters}
      noResultsMessage={t('itemsPage.noResults')}
    />
  )
}
