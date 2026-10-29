import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { GetStaticPaths, GetStaticProps } from 'next'

const idKeys = {
  weapon: 'object_id',
  armor: 'object_id',
  etcitem: 'object_id',
  skills: 'skill_id',
  armorsets: 'id',
} as const

export function getStaticPathsFor(
  dataset: keyof typeof idKeys,
): GetStaticPaths {
  return async () => {
    const file = join(process.cwd(), 'public', 'data', `${dataset}.json`)
    const records: Record<string, string | number>[] = JSON.parse(
      await readFile(file, 'utf8'),
    )
    const ids = new Set(
      records.map((record) => String(record[idKeys[dataset]])),
    )

    return {
      paths: [...ids].map((id) => ({ params: { id } })),
      fallback: false,
    }
  }
}

export const getStaticProps: GetStaticProps = async () => ({ props: {} })
