import { equal, match, notEqual, ok } from 'node:assert'
import { after, before, describe, test } from 'node:test'

import * as browser from '../index.browser.js'
import * as node from '../index.js'

for (let type of ['node', 'browser']) {
  let { customAlphabet, customRandom, nanoid, random, urlAlphabet } =
    type === 'node' ? node : browser

  describe(type, () => {
    if (type === 'browser') {
      before(() => {
        Object.defineProperty(global, 'crypto', {
          configurable: true,
          value: {
            getRandomValues(array) {
              for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256)
              }
              return array
            }
          }
        })
      })

      after(() => {
        Object.defineProperty(global, 'crypto', { value: undefined })
      })
    }

    test(`generates URL-friendly IDs`, () => {
      for (let i = 0; i < 100; i++) {
        let id = nanoid()
        equal(id.length, 21)
        equal(typeof id, 'string')
        for (let char of id) {
          match(urlAlphabet, new RegExp(char, 'g'))
        }
      }
    })

    test(`changes ID length`, () => {
      equal(nanoid(10).length, 10)
    })

    test(`accepts string`, () => {
      equal(nanoid('10').length, 10)
    })

    test(`has no collisions`, () => {
      let used = {}
      for (let i = 0; i < 50 * 1000; i++) {
        let id = nanoid()
        equal(used[id], undefined)
        used[id] = true
      }
    })

    test(`has flat distribution`, () => {
      let COUNT = 100 * 1000
      let LENGTH = nanoid().length

      let chars = {}
      for (let i = 0; i < COUNT; i++) {
        let id = nanoid()
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      }

      equal(Object.keys(chars).length, urlAlphabet.length)

      let max = 0
      let min = Number.MAX_SAFE_INTEGER
      for (let k in chars) {
        let distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
        if (distribution > max) max = distribution
        if (distribution < min) min = distribution
      }
      ok(max - min <= 0.05)
    })

    test(`${type} / customAlphabet / has options`, () => {
      let nanoidA = customAlphabet('a', 5)
      equal(nanoidA(), 'aaaaa')
    })

    test(`${type} / customAlphabet / has flat distribution`, () => {
      let COUNT = 50 * 1000
      let LENGTH = 30
      let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
      let nanoid2 = customAlphabet(ALPHABET, LENGTH)

      let chars = {}
      for (let i = 0; i < COUNT; i++) {
        let id = nanoid2()
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      }

      equal(Object.keys(chars).length, ALPHABET.length)

      let max = 0
      let min = Number.MAX_SAFE_INTEGER
      for (let k in chars) {
        let distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
        if (distribution > max) max = distribution
        if (distribution < min) min = distribution
      }
      ok(max - min <= 0.05)
    })

    test(`${type} / customAlphabet / changes size`, () => {
      let nanoidA = customAlphabet('a')
      equal(nanoidA(10), 'aaaaaaaaaa')
    })

    test(`${type} / customRandom / supports generator`, () => {
      let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
      function fakeRandom(size) {
        let bytes = []
        for (let i = 0; i < size; i += sequence.length) {
          bytes = bytes.concat(sequence.slice(0, size - i))
        }
        return bytes
      }
      let nanoid4 = customRandom('abcde', 4, fakeRandom)
      let nanoid18 = customRandom('abcde', 18, fakeRandom)
      equal(nanoid4(), 'adca')
      equal(nanoid18(), 'cbadcbadcbadcbadcc')
    })

    test(`${type} / urlAlphabet / is string`, () => {
      equal(typeof urlAlphabet, 'string')
    })

    test(`${type} / urlAlphabet / has no duplicates`, () => {
      for (let i = 0; i < urlAlphabet.length; i++) {
        equal(urlAlphabet.lastIndexOf(urlAlphabet[i]), i)
      }
    })

    test(`${type} / random / generates small random buffers`, () => {
      for (let i = 0; i < urlAlphabet.length; i++) {
        equal(random(10).length, 10)
      }
    })

    test(`${type} / random / generates random buffers`, () => {
      let numbers = {}
      let bytes = random(1000)
      equal(bytes.length, 1000)
      for (let byte of bytes) {
        if (!numbers[byte]) numbers[byte] = 0
        numbers[byte] += 1
        equal(typeof byte, 'number')
        ok(byte <= 255)
        ok(byte >= 0)
      }
    })

    if (type === 'node') {
      test(`${type} / proxy number / prevent collision`, () => {
        let makeProxyNumberToReproducePreviousID = () => {
          let step = 0
          return {
            valueOf() {
              // "if (!pool || pool.length < bytes) {"
              if (step === 0) {
                step++
                return 0
              }
              // "} else if (poolOffset + bytes > pool.length) {"
              if (step === 1) {
                step++
                return -Infinity
              }
              // "poolOffset += bytes"
              if (step === 2) {
                step++
                return 0
              }

              return 21
            }
          }
        }

        let id1 = nanoid()
        let id2 = nanoid(makeProxyNumberToReproducePreviousID())
        notEqual(id1, id2)
      })
    }
  })
}
