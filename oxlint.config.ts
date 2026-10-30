import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'eslint',
    'react',
    'unicorn',
    'oxc',
    'typescript',
    'nextjs',
    'import',
    'jsx-a11y',
  ],
  env: {
    builtin: true,
    browser: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'next-env.d.ts',
  ],
})
