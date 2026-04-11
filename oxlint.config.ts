import loguxOxlintConfig from '@logux/oxc-configs/lint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  options: {
    typeCheck: false
  },
  extends: [loguxOxlintConfig],
  ignorePatterns: ['test/demo/dist'],
  rules: {
    'unicorn/no-array-sort': 'off'
  }
})
