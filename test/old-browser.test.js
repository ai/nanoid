let { test } = require('uvu')
let { throws } = require('uvu/assert')

test.before(() => {
  delete global.crypto
})

test('warns to use non-secure generator on old browsers', () => {
  throws(() => {
    require('../index.browser')
  }, /use nanoid\/non-secure/)
})

test.run()
