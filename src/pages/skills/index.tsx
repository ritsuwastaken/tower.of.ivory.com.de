import { Head } from '@/components/Head'
import { sortData, paginateData } from '@/utils/pagination'
import { DataTable, useDataTable } from '@/components/DataTable'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types'
import { getDataUrl } from '@/utils/getDataUrl'
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
      }
    }
  })

  return Array.from(skillMap.values())
}

export default function SkillsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const formatColumnName = useFormatColumnName()

  const [mergeSkillsEnabled, setMergeSkillsEnabled] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [showChanged, setShowChanged] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const {
    searchTerm,
    currentPage,
    sortConfig,
    columnVisibility,
    itemsPerPage,
    handleSort,
    handleColumnVisibilityChange,
    handlePageChange,
    handleSearchChange,
    handleResetFilters,
  } = useDataTable<Skill>({
    defaultColumnVisibility: defaultColumns,
  })

  const { data: skills = [], isLoading } = useQuery<Skill[], Error>({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await fetch(getDataUrl('/data/skills.json'))
      const data = await response.json()
      return Array.isArray(data) ? data : []
    },
  })

  const mergeSkills = mergeSkillsEnabled && !showNew && !showChanged

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

  const { data: currentSkills, totalPages } = paginateData(
    sortData(filteredSkills, sortConfig),
    currentPage,
    itemsPerPage,
  )

  const handleSkillClick = (id: number) => {
    router.push(`/skills/${id}`)
  }

  useEffect(() => {
    handleColumnVisibilityChange('skill_level', !mergeSkills)
  }, [mergeSkills, handleColumnVisibilityChange])

  const checkboxFilters = [
    {
      id: 'merge-levels',
      label: t('filters.mergeLevels'),
      checked: mergeSkills,
      onChange: () => {
        setMergeSkillsEnabled((prev) => {
          const next = !prev

          if (next) {
            setShowNew(false)
            setShowChanged(false)
          }

          return next
        })
      },
    },
    {
      id: 'new-items',
      label: t('filters.onlyNewSkills'),
      checked: showNew,
      onChange: () => {
        setShowNew((prev) => {
          const next = !prev

          if (next) {
            setShowChanged(false)
            setMergeSkillsEnabled(false)
          }

          return next
        })
      },
    },
    {
      id: 'changed-items',
      label: t('filters.onlyChangedSkills'),
      checked: showChanged,
      onChange: () => {
        setShowChanged((prev) => {
          const next = !prev

          if (next) {
            setShowNew(false)
            setMergeSkillsEnabled(false)
          }

          return next
        })
      },
    },
  ]

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
                  ? getDataUrl('/icon/skill0000.webp')
                  : getDataUrl(`/icon/${skill.icon?.split('.').at(-1)}.webp`)
              }
              alt={
                skill.name ||
                t('skillDetails.unnamedSkill', { id: skill.skill_id })
              }
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
          return skill[column] ? t('common.yes') : t('common.no')
        default:
          return skill[column as keyof Skill]?.toString() || '-'
      }
    },
    [failedImages, t],
  )

  return (
    <>
      <Head description="Skills" />
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
        noResultsMessage={t('skillsPage.noResults')}
        onResetFilters={() => {
          handleResetFilters()
          setMergeSkillsEnabled(true)
          setShowNew(false)
          setShowChanged(false)
        }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        formatColumnName={formatColumnName}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}
