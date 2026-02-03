import { DataTable, useDataTable } from '@/components/DataTable'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Item } from '@/types/item'
import { getDataUrl } from '@/utils/dataUrl'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

const getDefaultColumns = (category: string) => {
  const common = {
    icon: true,
    object_name: false,
    name: true,
    description: false,
    crystal_type: false,
    weight: false,
    crystallizable: false,
    base_price: true,
    crystal_count: false,
    is_new: false,
    is_changed: false,
  }

  switch (category) {
    case 'weapon':
      return {
        ...common,
        crystal_type: true,
        crystal_count: true,
        physical_damage: true,
        magical_damage: true,
        attack_speed: false,
        mp_consume: false,
        weapon_type: true,
        soulshot_count: false,
        spiritshot_count: false,
      }
    case 'armor':
      return {
        ...common,
        crystal_type: true,
        crystal_count: true,
        body_part: false,
        physical_defense: true,
        magical_defense: true,
        armor_type: false,
        mp_bonus: false,
        description: true,
      }
    case 'etcitem':
      return {
        ...common,
        weight: true,
        description: true,
      }
    default:
      return common
  }
}

const urlMap: Record<'weapon' | 'armor' | 'etcitem', string> = {
  weapon: 'weapons',
  armor: 'armor',
  etcitem: 'etc',
}

export const ItemsPage = ({
  type,
}: {
  type: 'weapon' | 'armor' | 'etcitem'
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const formatColumnName = useFormatColumnName()

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
  } = useDataTable<Item>({
    itemsPerPage: 50,
    defaultColumnVisibility: getDefaultColumns(type),
    defaultViewMode: 'table',
    onResetFilters: () => {
      setCrystalType('')
      setBodyPart('')
      setArmorType('')
      setWeaponType('')
      setShowNew(false)
      setShowChanged(false)
    },
  })

  const crystalTypeFromParams = searchParams.get('crystal') || ''
  const bodyPartFromParams = searchParams.get('bodyPart') || ''
  const armorTypeFromParams = searchParams.get('armorType') || ''
  const weaponTypeFromParams = searchParams.get('weaponType') || ''

  const showNewFromParams = searchParams.get('new') === 'true'
  const showChangedFromParams = searchParams.get('changed') === 'true'

  const [showNew, setShowNew] = useState(showNewFromParams)
  const [showChanged, setShowChanged] = useState(showChangedFromParams)

  const [crystalType, setCrystalType] = useState(crystalTypeFromParams)
  const [bodyPart, setBodyPart] = useState(bodyPartFromParams)
  const [armorType, setArmorType] = useState(armorTypeFromParams)
  const [weaponType, setWeaponType] = useState(weaponTypeFromParams)

  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const { data: items = [], isLoading } = useQuery<Item[], Error>({
    queryKey: ['items', type],
    queryFn: async () => {
      const url = getDataUrl(`/data/${type}.json`)
      const response = await fetch(url)
      const data = await response.json()
      return Array.isArray(data) ? data : []
    },
  })

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch = (item.name || item.object_name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

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

        const matchesNew = !showNew || item.is_new === true
        const matchesChanged = !showChanged || item.is_changed === true

        return (
          matchesSearch &&
          matchesCrystalType &&
          matchesBodyPart &&
          matchesArmorType &&
          matchesWeaponType &&
          matchesNew &&
          matchesChanged
        )
      }),
    [
      armorType,
      bodyPart,
      crystalType,
      items,
      searchTerm,
      showChanged,
      showNew,
      weaponType,
    ],
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig.column) return 0

    const aValue = a[sortConfig.column]
    const bValue = b[sortConfig.column]

    if (aValue === bValue) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1

    if (sortConfig.column === 'crystal_type') {
      const gradeOrder = { none: 0, d: 1, c: 2, b: 3, a: 4, s: 5 }
      const aGrade = (aValue as string)?.toLowerCase() || 'none'
      const bGrade = (bValue as string)?.toLowerCase() || 'none'

      const aRank = gradeOrder[aGrade as keyof typeof gradeOrder] ?? 0
      const bRank = gradeOrder[bGrade as keyof typeof gradeOrder] ?? 0

      return sortConfig.direction === 'asc' ? aRank - bRank : bRank - aRank
    }

    const compareResult =
      typeof aValue === 'string'
        ? (aValue as string).localeCompare(bValue as string)
        : (aValue as number) - (bValue as number)

    return sortConfig.direction === 'asc' ? compareResult : -compareResult
  })

  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const formatCrystalType = (type: string | undefined): string => {
    if (!type) return '-'
    return type.toLowerCase() === 'none' ? 'None' : type.toUpperCase()
  }

  const columns = useMemo(
    () =>
      Object.entries(columnVisibility).map(([key, visible]) => ({
        key: key as keyof Item,
        label: key === 'icon' ? '' : formatColumnName(key),
        visible,
      })),
    [columnVisibility, formatColumnName],
  )

  const renderCell = useCallback(
    (item: Item, column: string) => {
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
            <Image
              src={
                failedImages.has(item.object_id)
                  ? '/icon/etc_alphabet_ii_i00.webp'
                  : `/icon/${item?.icon?.[0].split('.').at(-1)}.webp`
              }
              alt={item.name || item.object_name}
              width={32}
              height={32}
              style={{
                borderRadius: '4px',
                border: '1px solid #3a3a3a',
              }}
              onError={() => {
                setFailedImages((prev) => new Set(prev).add(item.object_id))
              }}
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
    },
    [failedImages, type],
  )

  const filters = useMemo(() => {
    const uniqueBodyParts = [
      ...new Set(
        items
          .flatMap((item) => item.body_part)
          .filter((part): part is string => !!part?.length)
          .map((part) => part.toLowerCase()),
      ),
    ].sort()

    const uniqueArmorTypes = [
      ...new Set(
        items
          .map((item) => item.armor_type)
          .filter(Boolean)
          .map((type) => type!.toLowerCase()),
      ),
    ].sort()

    const uniqueWeaponTypes = [
      ...new Set(
        items
          .map((item) => item.weapon_type)
          .filter(Boolean)
          .map((type) => type!.toLowerCase()),
      ),
    ].sort()

    const baseFilters = [
      {
        id: 'crystal-type',
        label: 'Grade',
        value: crystalType,
        onChange: setCrystalType,
        options: [
          { value: '', label: '-' },
          { value: 'None', label: 'None' },
          { value: 'D', label: 'D' },
          { value: 'C', label: 'C' },
          { value: 'B', label: 'B' },
          { value: 'A', label: 'A' },
          { value: 'S', label: 'S' },
        ],
      },
    ]

    if (uniqueBodyParts.length > 0) {
      baseFilters.push({
        id: 'body-part',
        label: 'Body Part',
        value: bodyPart,
        onChange: setBodyPart,
        options: [
          { value: '', label: '-' },
          ...uniqueBodyParts.map((part) => ({
            value: part,
            label: part
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
          })),
        ],
      })
    }

    if (uniqueArmorTypes.length > 0 && type === 'armor') {
      baseFilters.push({
        id: 'armor-type',
        label: 'Armor Type',
        value: armorType,
        onChange: setArmorType,
        options: [
          { value: '', label: '-' },
          ...uniqueArmorTypes.map((type) => ({
            value: type,
            label: type
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
          })),
        ],
      })
    }

    if (uniqueWeaponTypes.length > 0 && type === 'weapon') {
      baseFilters.push({
        id: 'weapon-type',
        label: 'Weapon Type',
        value: weaponType,
        onChange: setWeaponType,
        options: [
          { value: '', label: '-' },
          ...uniqueWeaponTypes.map((type) => ({
            value: type,
            label: type
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
          })),
        ],
      })
    }

    return baseFilters
  }, [items, type, crystalType, bodyPart, armorType, weaponType])

  const checkboxFilters = useMemo(
    () => [
      {
        id: 'new-items',
        label: 'Only New Items',
        checked: showNew,
        onChange: () => {
          setShowNew(!showNew)
          if (!showNew) {
            setShowChanged(false)
          }
        },
      },
      {
        id: 'changed-items',
        label: 'Only Changed Items',
        checked: showChanged,
        onChange: () => {
          setShowChanged(!showChanged)
          if (!showChanged) {
            setShowNew(false)
          }
        },
      },
    ],
    [showNew, showChanged],
  )

  return (
    <DataTable
      currentPage={currentPage}
      totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
      onPageChange={handlePageChange}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      data={currentItems}
      columns={columns}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('itemsPage.searchPlaceholder')}
      onSort={handleSort}
      sortConfig={sortConfig}
      onRowClick={(item) => router.push(`/${urlMap[type]}/${item.object_id}`)}
      renderCell={renderCell}
      filters={filters}
      checkboxFilters={checkboxFilters}
      noResultsMessage="No items found matching your criteria"
      onResetFilters={handleResetFilters}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      formatColumnName={formatColumnName}
    />
  )
}
