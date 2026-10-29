import { defineConfig } from 'lint-staged/config'

export default defineConfig({
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}': 'eslint --fix --no-warn-ignored',
  '*': 'prettier --write --ignore-unknown',
})
