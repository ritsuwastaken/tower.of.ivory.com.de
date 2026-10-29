'use client'

import { sortData, paginateData } from '@/utils/pagination'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { DataTable, useDataTable } from '@/components/DataTable'
import { ArmorSet } from '@/types'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  defaultArmorSetColumns,
  getArmorSetColumnLabels,
} from './DataTable/columns'

export default function ArmorSetsPage({
  armorSets,
}: {
  armorSets: ArmorSet[]
}) {
  const router = useRouter()
  const { t } = useTranslation()

  const [grade, setGrade] = useState('')
  const [armorType, setArmorType] = useState('')

  const { tableProps, deferredSearchTerm, itemsPerPage } =
    useDataTable<ArmorSet>({
      defaultColumnVisibility: defaultArmorSetColumns,
      columnLabels: getArmorSetColumnLabels(t),
      onResetFilters: () => {
        setGrade('')
        setArmorType('')
      },
    })

  const uniqueGrades = [...new Set(armorSets.map((set) => set.grade))].sort()
  const uniqueArmorTypes = [
    ...new Set(armorSets.map((set) => set.armor_type)),
  ].sort()

  const capitalizeGrade = (grade: string | undefined): string => {
    if (!grade) return '-'
    return grade.toLowerCase() === 'none'
      ? t('filters.gradeNone')
      : grade.toUpperCase()
  }

  const handleRowClick = ({ id }: ArmorSet) => {
    router.push(`/armorsets/${id}`)
  }

  const filteredArmorSets = armorSets.filter(
    (set) =>
      set.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) &&
      (!grade || set.grade === grade) &&
      (!armorType ||
        set.items.some(
          (item) => item.armor_type?.toLowerCase() === armorType.toLowerCase(),
        )),
  )

  const { data: currentArmorSets, totalPages } = paginateData(
    sortData(filteredArmorSets, tableProps.sortConfig, 'grade'),
    tableProps.currentPage,
    itemsPerPage,
  )

  const filters = [
    {
      id: 'grade',
      label: t('filters.grade'),
      value: grade,
      onChange: setGrade,
      options: [
        { value: '', label: t('filters.all') },
        ...uniqueGrades.map((g) => ({
          value: g,
          label: capitalizeGrade(g),
        })),
      ],
    },
    {
      id: 'armorType',
      label: t('filters.armorType'),
      value: armorType,
      onChange: setArmorType,
      options: [
        { value: '', label: t('filters.all') },
        ...uniqueArmorTypes.map((type) => ({
          value: type,
          label: type,
        })),
      ],
    },
  ]

  const renderCell = (armorSet: ArmorSet, column: string) => {
    switch (column) {
      case 'visual':
        return <ArmorSetVisual armorSet={armorSet} />
      case 'name':
        return (
          <Link
            rel="canonical"
            href={`/armorsets/${armorSet.id}`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {armorSet.name}
          </Link>
        )
      case 'grade':
        return capitalizeGrade(armorSet.grade)
      case 'items':
        return armorSet.items.map((item) => item.name).join(', ') || '-'
      case 'bonus_stats':
        return armorSet.set_bonus || '-'
      default:
        return armorSet[column as keyof ArmorSet]?.toString() || '-'
    }
  }

  return (
    <DataTable
      {...tableProps}
      enableGridView
      data={currentArmorSets}
      totalPages={totalPages}
      searchPlaceholder={t('armorSetsPage.searchPlaceholder')}
      onRowClick={handleRowClick}
      renderCell={renderCell}
      filters={filters}
      noResultsMessage={t('armorSetsPage.noResults')}
    />
  )
}
