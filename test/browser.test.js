import { equal } from 'node:assert'
import { describe, test } from 'node:test'

import * as browser from '../index.browser.js'

// Real WebCrypto rejects `crypto.getRandomValues` requests over 65536 bytes.
// These tests run without the crypto mock from `index.test.js`,
// to check that the browser build fills big buffers the same way
// as the Node build in `index.js`.
describe('browser build with real crypto', () => {
  test(`generates IDs bigger than 65536 bytes`, () => {
    let id = browser.nanoid(70000)
    equal(id.length, 70000)
    equal(typeof id, 'string')
  })

  test(`generates big random buffers`, () => {
    equal(browser.random(131072).length, 131072)
  })
})
