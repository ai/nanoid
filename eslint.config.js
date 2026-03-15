import loguxConfig from '@logux/eslint-config'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['test/demo/build', 'nanoid.js'] },
  ...loguxConfig,
  {
    rules: {
      'n/no-unsupported-features/node-builtins': 'off'
    }
  }
]
