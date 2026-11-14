import fs from 'fs'
import path from 'path'

const directory = path.join(
  process.cwd(),
  'node_modules/l2asmdisasm/definitions',
)

export const definitionFiles = () =>
  fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .sort()

export const definitionNames = () =>
  definitionFiles().map((file) => file.slice(0, -'.json'.length))

export const readDefinition = (file: string) =>
  fs.readFileSync(path.join(directory, file))
