'use client'

import { sortData, paginateData } from '@/utils/pagination'
import { DataTable, useDataTable } from '@/components/DataTable'
import { Skill } from '@/types'
import { CatalogIcon } from './CatalogImage'
import { matchesChangeFilter, type ChangeFilter } from '@/utils/filters'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { defaultSkillColumns } from './DataTable/columns'

const mergeSkillLevels = (skills: Skill[]): Skill[] => {
  const skillMap = new Map<number, Skill>()

  for (const skill of skills) {
    const previous = skillMap.get(skill.skill_id)
    const levels = previous?.levels ?? []
    levels.push(skill)

    if (
      !previous ||
      (skill.skill_level &&
        (!previous.skill_level || skill.skill_level > previous.skill_level))
    ) {
      skillMap.set(skill.skill_id, { ...previous, ...skill, levels })
    }
  }

  return Array.from(skillMap.values())
}

export default function SkillsPage({ skills }: { skills: Skill[] }) {
  const { t } = useTranslation()
  const router = useRouter()

  const [mergeSkillsEnabled, setMergeSkillsEnabled] = useState(true)
  const [changeFilter, setChangeFilter] = useState<ChangeFilter>('all')
  const { tableProps, deferredSearchTerm, itemsPerPage } = useDataTable<Skill>({
    defaultColumnVisibility: defaultSkillColumns,
    onResetFilters: () => {
      setMergeSkillsEnabled(true)
      setChangeFilter('all')
    },
  })

  const mergeSkills = mergeSkillsEnabled && changeFilter === 'all'

  const processedSkills = mergeSkills ? mergeSkillLevels(skills) : skills

  const filteredSkills = processedSkills.filter((skill) => {
    const matchesSearch = skill.name
      ?.toLowerCase()
      ?.includes(deferredSearchTerm.toLowerCase())

    return matchesSearch && matchesChangeFilter(skill, changeFilter)
  })

  const { data: currentSkills, totalPages } = paginateData(
    sortData(filteredSkills, tableProps.sortConfig),
    tableProps.currentPage,
    itemsPerPage,
  )

  const { onColumnVisibilityChange } = tableProps
  useEffect(() => {
    onColumnVisibilityChange('skill_level', !mergeSkills)
  }, [mergeSkills, onColumnVisibilityChange])

  const checkboxFilters = [
    {
      id: 'merge-levels',
      label: t('filters.mergeLevels'),
      checked: mergeSkills,
      onChange: () => {
        setMergeSkillsEnabled(!mergeSkills)
        setChangeFilter('all')
      },
    },
    ...(['new', 'changed'] as const).map((value) => ({
      id: `${value}-items`,
      label: t(
        value === 'new' ? 'filters.onlyNewSkills' : 'filters.onlyChangedSkills',
      ),
      checked: changeFilter === value,
      onChange: () => {
        setMergeSkillsEnabled(false)
        setChangeFilter((previous) => (previous === value ? 'all' : value))
      },
    })),
  ]

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
        return skill[column as keyof Skill]?.toString() || '-'
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
      checkboxFilters={checkboxFilters}
      noResultsMessage={t('skillsPage.noResults')}
    />
  )
}
