import { DataTable, useDataTable } from '@/components/DataTable'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types/skill'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

const defaultColumns: Partial<Record<keyof Skill, boolean>> = {
  icon: true,
  name: true,
  description: true,
  mp_consume: true,
  hp_consume: true,
  reuse_delay: true,
  skill_level: false,
  is_magic: false,
  is_new: false,
  is_changed: false,
}

const mergeSkillLevels = (skills: Skill[]): Skill[] => {
  const skillMap = new Map<number, Skill>()

  skills.forEach((skill) => {
    if (!skillMap.has(skill.skill_id)) {
      skillMap.set(skill.skill_id, {
        ...skill,
        levels: [skill],
      })
    } else {
      const existingSkill = skillMap.get(skill.skill_id)!
      existingSkill.levels!.push(skill)

      if (
        skill.skill_level &&
        (!existingSkill.skill_level ||
          skill.skill_level > existingSkill.skill_level)
      ) {
        const latestData = { ...skill }
        delete latestData.levels
        Object.assign(existingSkill, latestData)
        existingSkill.levels = existingSkill.levels
      }
    }
  })

  return Array.from(skillMap.values())
}

export const SkillsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const formatColumnName = useFormatColumnName()

  const [mergeSkills, setMergeSkills] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [showChanged, setShowChanged] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

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
  } = useDataTable<Skill>({
    defaultColumnVisibility: defaultColumns,
  })

  const { data: skills = [], isLoading } = useQuery<Skill[], Error>({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await fetch('/data/skills.json')
      const data = await response.json()
      return Array.isArray(data) ? data : []
    },
  })

  const processedSkills = useMemo(() => {
    return mergeSkills ? mergeSkillLevels(skills) : skills
  }, [skills, mergeSkills])

  const filteredSkills = processedSkills.filter((skill) => {
    const matchesSearch = skill.name
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase())

    const matchesNew = !showNew || skill.is_new === true
    const matchesChanged = !showChanged || skill.is_changed === true
    return matchesSearch && matchesNew && matchesChanged
  })

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (!sortConfig.column) return 0

    const aValue = a[sortConfig.column]
    const bValue = b[sortConfig.column]

    if (aValue === bValue) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1

    const compareResult =
      typeof aValue === 'string'
        ? (aValue as string).localeCompare(bValue as string)
        : (aValue as number) - (bValue as number)

    return sortConfig.direction === 'asc' ? compareResult : -compareResult
  })

  const currentSkills = sortedSkills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSkillClick = (id: number) => {
    router.push(`/skills/${id}`)
  }

  useEffect(() => {
    if (showNew || showChanged) {
      setMergeSkills(false)
    }
  }, [showNew, showChanged])

  useEffect(() => {
    handleColumnVisibilityChange('skill_level', !mergeSkills)
  }, [mergeSkills, handleColumnVisibilityChange])

  const checkboxFilters = useMemo(
    () => [
      {
        id: 'merge-levels',
        label: t('filters.mergeLevels'),
        checked: mergeSkills,
        onChange: () => {
          setMergeSkills(!mergeSkills)
          if (!mergeSkills) {
            setShowNew(false)
            setShowChanged(false)
          }
        },
      },
      {
        id: 'new-items',
        label: t('filters.onlyNewSkills'),
        checked: showNew,
        onChange: () => {
          setShowNew(!showNew)
          if (!showNew) {
            setMergeSkills(false)
            setShowChanged(false)
          }
        },
      },
      {
        id: 'changed-items',
        label: t('filters.onlyChangedSkills'),
        checked: showChanged,
        onChange: () => {
          setShowChanged(!showChanged)
          if (!showChanged) {
            setMergeSkills(false)
            setShowNew(false)
          }
        },
      },
    ],
    [mergeSkills, showNew, showChanged, t],
  )

  const columns = useMemo(
    () =>
      Object.entries(columnVisibility).map(([key, visible]) => ({
        key: key as keyof Skill,
        label: key === 'icon' ? '' : formatColumnName(key),
        visible: visible as boolean,
      })),
    [columnVisibility, formatColumnName],
  )

  const renderCell = useCallback(
    (skill: Skill, column: string) => {
      switch (column) {
        case 'name':
          return (
            <Link
              rel="canonical"
              href={`/skills/${skill.skill_id}`}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              {skill.name}
            </Link>
          )
        case 'icon':
          return (
            <Image
              src={
                failedImages.has(skill.skill_id)
                  ? '/icon/etc_alphabet_s_i00.webp'
                  : `/icon/${skill.icon?.split('.').at(-1)}.webp`
              }
              alt={skill.name || `Unnamed skill with id ${skill.skill_id}`}
              width={32}
              height={32}
              onError={() => {
                setFailedImages((prev) => new Set(prev).add(skill.skill_id))
              }}
              style={{
                borderRadius: '4px',
                border: '1px solid #3a3a3a',
              }}
            />
          )
        case 'is_magic':
          return skill[column] ? 'Yes' : 'No'
        default:
          return skill[column as keyof Skill]?.toString() || '-'
      }
    },
    [failedImages],
  )

  return (
    <DataTable
      data={currentSkills}
      columns={columns}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('skillsPage.searchPlaceholder')}
      onSort={handleSort}
      sortConfig={sortConfig}
      onRowClick={(skill) => handleSkillClick(skill.skill_id)}
      renderCell={renderCell}
      checkboxFilters={checkboxFilters}
      noResultsMessage="No skills found matching your criteria"
      onResetFilters={() => {
        handleResetFilters()
        setMergeSkills(true)
        setShowNew(false)
        setShowChanged(false)
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      formatColumnName={formatColumnName}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      currentPage={currentPage}
      totalPages={Math.ceil(filteredSkills.length / itemsPerPage)}
      onPageChange={handlePageChange}
    />
  )
}
