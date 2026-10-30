'use client'

import { formatPropertyValue } from '@/utils/formatPropertyValue'
import { sortData, paginateData } from '@/utils/pagination'
import { DataTable, useDataTable } from '@/components/DataTable'
import { Skill } from '@/types'
import { CatalogIcon } from './CatalogImage'
import { matchesChangeFilter, type ChangeFilter } from '@/utils/filters'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { defaultSkillColumns } from './DataTable/columns'

const mergeSkillLevels = (skills: Skill[]): Skill[] => {
  const skillMap = new Map<number, Skill>()

  for (const skill of skills) {
    const previous = skillMap.get(skill.skill_id)

    if (
      !previous ||
      (skill.skill_level &&
        (!previous.skill_level || skill.skill_level > previous.skill_level))
    ) {
      skillMap.set(skill.skill_id, skill)
    }
  }

  return Array.from(skillMap.values())
}

export default function SkillsPage({ skills }: { skills: Skill[] }) {
  const { t } = useTranslation()
  const router = useRouter()

  const [mode, setMode] = useState<ChangeFilter | 'merged'>('merged')
  const { tableProps, deferredSearchTerm, itemsPerPage } = useDataTable<Skill>({
    defaultColumnVisibility: defaultSkillColumns,
    onResetFilters: () => handleModeChange('merged'),
  })

  const mergeSkills = mode === 'merged'

  const processedSkills = mergeSkills ? mergeSkillLevels(skills) : skills

  const filteredSkills = processedSkills.filter((skill) => {
    const matchesSearch = skill.name
      ?.toLowerCase()
      ?.includes(deferredSearchTerm.toLowerCase())

    return (
      matchesSearch && matchesChangeFilter(skill, mergeSkills ? 'all' : mode)
    )
  })

  const { data: currentSkills, totalPages } = paginateData(
    sortData(filteredSkills, tableProps.sortConfig),
    tableProps.currentPage,
    itemsPerPage,
  )

  function handleModeChange(value: string) {
    setMode(value as ChangeFilter | 'merged')
    if ((value === 'merged') !== mergeSkills) {
      tableProps.onColumnVisibilityChange('skill_level', value !== 'merged')
    }
  }

  const filters = [
    {
      id: 'skill-mode',
      label: t('filters.show'),
      value: mode,
      onChange: handleModeChange,
      options: [
        { value: 'merged', label: t('filters.mergeLevels') },
        { value: 'all', label: t('filters.all') },
        { value: 'new', label: t('filters.onlyNewSkills') },
        { value: 'changed', label: t('filters.onlyChangedSkills') },
      ],
    },
  ]

  const renderCell = (skill: Skill, column: string) => {
    switch (column) {
      case 'name':
        return (
          <Link
            href={`/skills/${skill.skill_id}`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {skill.name}
          </Link>
        )
      case 'icon':
        return (
          <CatalogIcon
            icon={skill.icon}
            fallback="skill0000"
            alt={
              skill.name ||
              t('skillDetails.unnamedSkill', { id: skill.skill_id })
            }
          />
        )
      case 'is_magic':
        return skill[column] ? t('common.yes') : t('common.no')
      default:
        return formatPropertyValue(skill[column as keyof Skill]) || '-'
    }
  }

  return (
    <DataTable
      {...tableProps}
      data={currentSkills}
      totalPages={totalPages}
      searchPlaceholder={t('skillsPage.searchPlaceholder')}
      onRowClick={(skill) => router.push(`/skills/${skill.skill_id}`)}
      renderCell={renderCell}
      filters={filters}
      noResultsMessage={t('skillsPage.noResults')}
    />
  )
}
