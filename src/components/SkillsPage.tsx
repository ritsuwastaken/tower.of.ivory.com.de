'use client'

import { sortData, paginateData } from '@/utils/pagination'
import { DataTable, useDataTable } from '@/components/DataTable'
import { useFormatColumnName } from '@/hooks/useFormatColumnName'
import { Skill } from '@/types'
import { useDataUrl } from '@/hooks/useDataUrl'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { defaultSkillColumns } from './DataTable/columns'

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

export default function SkillsPage({ skills }: { skills: Skill[] }) {
  const getDataUrl = useDataUrl()
  const { t } = useTranslation()
  const router = useRouter()
  const formatColumnName = useFormatColumnName()

  const [mergeSkillsEnabled, setMergeSkillsEnabled] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [showChanged, setShowChanged] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const {
    searchTerm,
    deferredSearchTerm,
    isSearchPending,
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
    defaultColumnVisibility: defaultSkillColumns,
  })

  const mergeSkills = mergeSkillsEnabled && !showNew && !showChanged

  const processedSkills = mergeSkills ? mergeSkillLevels(skills) : skills

  const filteredSkills = processedSkills.filter((skill) => {
    const matchesSearch = skill.name
      ?.toLowerCase()
      ?.includes(deferredSearchTerm.toLowerCase())

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

  const columns = Object.entries(columnVisibility).map(([key, visible]) => ({
    key: key as keyof Skill,
    label: key === 'icon' ? '' : formatColumnName(key),
    visible: visible as boolean,
  }))

  const renderCell = (skill: Skill, column: string) => {
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
  }

  return (
    <>
      <DataTable
        data={currentSkills}
        columns={columns}
        isSearchPending={isSearchPending}
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
