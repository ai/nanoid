let { test } = require('uvu')
let { is, not } = require('uvu/assert')

test.before(() => {
  global.navigator = {
    product: 'ReactNative'
  }

  global.crypto = {
    getRandomValues(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
})

test.after(() => {
  delete global.navigator
  delete global.crypto
})

test('works with polyfill', () => {
  let { nanoid } = require('../index.browser')

  is(typeof nanoid(), 'string')
})

test('nanoid / avoids pool pollution, infinite loop', () => {
  let { nanoid } = require('../index.browser')
  nanoid(2.1)
  const second = nanoid()
  const third = nanoid()
  not.equal(second, third)
})

test.run()
