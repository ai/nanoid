let { test } = require('uvu')
let { throws } = require('uvu/assert')

test.before(() => {
  global.msCrypto = {}
  delete global.crypto
})

test.after(() => {
  delete global.msCrypto
})

test('shows error in IE', () => {
  throws(() => {
    // Since uvu runs all tests within same context, ensure to clear require cache
    delete require.cache[require.resolve('../index.browser')]
    require('../index.browser')
  }, /IE 11/)
})

test.run()
