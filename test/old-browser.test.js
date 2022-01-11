let { test } = require('uvu')
let assert = require('uvu/assert')

test.before(() => {
  delete global.crypto
})

test('warns to use non-secure generator on old browsers', () => {
  assert.throws(() => {
    require('../index.browser')
  }, /use nanoid\/non-secure/)
})

test.run()
