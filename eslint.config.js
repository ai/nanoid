import loguxConfig from '@logux/eslint-config'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['test/demo/build', 'nanoid.js', '**/errors.ts'] },
  ...loguxConfig,
  {
    rules: {
      'func-style': 'off',
      'yoda': 'off'
    }
  }
]
