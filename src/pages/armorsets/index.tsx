import { Head } from '@/components/Head'
import { sortData, paginateData } from '@/utils/pagination'
import { ArmorSetVisual } from '@/components/ArmorSetVisual'
import { DataTable, useDataTable } from '@/components/DataTable'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { ArmorSet } from '@/types'
import { getTotalBasePrice, getTotalPhysicalDefense } from '@/utils/getTotalX'
import { getDataUrl } from '@/utils/getDataUrl'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

export default function ArmorSetsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const formatColumnName = useFormatColumnName()

  const [grade, setGrade] = useState('')
  const [armorType, setArmorType] = useState('')

  const {
    searchTerm,
    currentPage,
    sortConfig,
    columnVisibility,
    viewMode,
    itemsPerPage,
    handleSort,
    handleColumnVisibilityChange,
    handleViewModeChange,
    handlePageChange,
    handleSearchChange,
    handleResetFilters,
  } = useDataTable<ArmorSet>({
    defaultColumnVisibility: {
      visual: true,
      name: true,
      grade: true,
      physical_defense: true,
      base_price: true,
      items: true,
      bonus_stats: true,
    },
  })

  const { data: armorSetsData = [], isLoading } = useQuery<ArmorSet[], Error>({
    queryKey: ['armorSets'],
    queryFn: async () => {
      const response = await fetch(getDataUrl('/data/armorsets.json'))
      if (!response.ok) {
        throw new Error('Failed to fetch armor sets')
      }
      return response.json()
    },
    select: (data) =>
      data.map((set) => ({
        ...set,
        physical_defense: getTotalPhysicalDefense(set.items),
        base_price: getTotalBasePrice(set.items),
      })),
  })

  const uniqueGrades = [
    ...new Set(armorSetsData.map((set) => set.grade)),
  ].sort()
  const uniqueArmorTypes = [
    ...new Set(armorSetsData.map((set) => set.armor_type)),
  ].sort()

  const capitalizeGrade = useCallback(
    (grade: string | undefined): string => {
      if (!grade) return '-'
      return grade.toLowerCase() === 'none'
        ? t('filters.gradeNone')
        : grade.toUpperCase()
    },
    [t],
  )

  const handleRowClick = ({ id }: ArmorSet) => {
    router.push(`/armorsets/${id}`)
  }

  const filteredArmorSets = Array.isArray(armorSetsData)
    ? armorSetsData.filter((set) => {
        const matchesSearch = set.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesGrade = !grade || set.grade === grade
        const matchesType =
          !armorType ||
          (set.items &&
            set.items.some(
              (item) =>
                item.armor_type &&
                item.armor_type.toLowerCase() === armorType.toLowerCase(),
            ))
        return matchesSearch && matchesGrade && matchesType
      })
    : []

  const { data: currentArmorSets, totalPages } = paginateData(
    sortData(filteredArmorSets, sortConfig, 'grade'),
    currentPage,
    itemsPerPage,
  )

  const filters = useMemo(() => {
    const baseFilters = [
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

    return baseFilters
  }, [grade, armorType, uniqueGrades, uniqueArmorTypes, t, capitalizeGrade])

  const renderCell = useCallback(
    (armorSet: ArmorSet, column: string) => {
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
          return armorSet.items?.map((item) => item.name).join(', ') || '-'
        case 'bonus_stats':
          return armorSet.set_bonus || '-'
        default:
          return armorSet[column as keyof ArmorSet]?.toString() || '-'
      }
    },
    [capitalizeGrade],
  )

  const columns = useMemo(() => {
    const labelMap: Partial<Record<keyof ArmorSet | 'visual', string>> = {
      visual: '',
      name: t('armorSetsPage.name'),
      grade: t('filters.grade'),
      items: t('armorSetsPage.parts'),
      bonus_stats: t('armorSetsPage.bonus'),
      physical_defense: t('armorSetsPage.physicalDefense'),
      base_price: t('armorSetsPage.basePrice'),
    }

    return Object.entries(columnVisibility).map(([key, visible]) => ({
      key: key as keyof ArmorSet | 'visual',
      label: labelMap[key as keyof typeof labelMap] ?? formatColumnName(key),
      visible: Boolean(visible),
    }))
  }, [columnVisibility, formatColumnName, t])

  return (
    <>
      <Head description="Armor Sets" />
      <DataTable
        enableGridView
        data={currentArmorSets}
        columns={columns}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder={t('armorSetsPage.searchPlaceholder')}
        onSort={handleSort}
        sortConfig={sortConfig}
        onRowClick={handleRowClick}
        renderCell={renderCell}
        filters={filters}
        noResultsMessage={t('armorSetsPage.noResults')}
        onResetFilters={() => {
          handleResetFilters()
          setGrade('')
          setArmorType('')
        }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        formatColumnName={formatColumnName}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}
