import { equal, match } from 'node:assert'
import { describe, test } from 'node:test'

import { nanoid, urlAlphabet } from '../index.js'

describe('pool pollution', () => {
  test(`generates large IDs`, () => {
    try {
      nanoid(1000)
    } catch {}
    try {
      nanoid(500)
    } catch {}
    let id = nanoid(100)
    equal(id.length, 100)
    for (let char of id) {
      match(urlAlphabet, new RegExp(char, 'g'))
    }
  })
})

