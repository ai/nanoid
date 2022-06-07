import { test } from 'uvu'
import { is } from 'uvu/assert'

import { nanoid } from '../index.browser.js'

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
  is(typeof nanoid(), 'string')
})

test.run()
