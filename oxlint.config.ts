import loguxOxlintConfig from '@logux/oxc-configs/lint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  options: {
    typeCheck: false
  },
  extends: [loguxOxlintConfig],
  ignorePatterns: ['test/demo/dist'],
  // The generated CDN build uses `var` for smaller Rolldown output.
  overrides: [
    {
      files: ['nanoid.js'],
      rules: {
        'block-scoped-var': 'off',
        'no-var': 'off',
        'prefer-let/prefer-let': 'off'
      }
    }
  ],
  rules: {
    'unicorn/no-array-sort': 'off'
  }
})
