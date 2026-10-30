import { defineConfig } from 'lint-staged/config'

export default defineConfig({
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}': 'oxlint --type-aware --fix',
  '*': 'prettier --write --ignore-unknown',
})
