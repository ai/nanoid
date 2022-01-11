let { test } = require('uvu')
let assert = require('uvu/assert')

test.before(() => {
  global.navigator = {
    product: 'ReactNative'
  }
})

test.after(() => {
  delete global.navigator
})

test('tells to use non-secure generator on old browsers', () => {
  assert.throws(() => {
    // Since uvu runs all tests within same context, ensure to clear require cache
    delete require.cache[require.resolve('../index.browser')]
    require('../index.browser')
  }, /React Native does not have/)
})

test.run()
