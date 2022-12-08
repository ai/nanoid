import { is, ok, equal, match } from 'uvu/assert'
import { test } from 'uvu'

import * as browser from '../index.browser.js'
import * as node from '../index.js'

test.before(() => {
  Object.defineProperty(global, 'crypto', {
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

test.after(() => {
  Object.defineProperty(global, 'crypto', { value: undefined })
})

for (let type of ['node', 'browser']) {
  let { nanoid, customAlphabet, customRandom, random, urlAlphabet } =
    type === 'node' ? node : browser

  test(`${type} / nanoid / generates URL-friendly IDs`, () => {
    for (let i = 0; i < 100; i++) {
      let id = nanoid()
      is(id.length, 21)
      is(typeof id, 'string')
      for (let char of id) {
        match(urlAlphabet, new RegExp(char, 'g'))
      }
    }
  })

  test(`${type} / nanoid / changes ID length`, () => {
    is(nanoid(10).length, 10)
  })

  test(`${type} / nanoid / accepts string`, () => {
    is(nanoid('10').length, 10)
  })

  test(`${type} / nanoid / has no collisions`, () => {
    let used = {}
    for (let i = 0; i < 50 * 1000; i++) {
      let id = nanoid()
      is(used[id], undefined)
      used[id] = true
    }
  })

  test(`${type} / nanoid / has flat distribution`, () => {
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

    is(Object.keys(chars).length, urlAlphabet.length)

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
    is(nanoidA(), 'aaaaa')
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

    is(Object.keys(chars).length, ALPHABET.length)

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
    is(nanoidA(10), 'aaaaaaaaaa')
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
    is(nanoid4(), 'adca')
    is(nanoid18(), 'cbadcbadcbadcbadcc')
  })

  test(`${type} / urlAlphabet / is string`, () => {
    is(typeof urlAlphabet, 'string')
  })

  test(`${type} / urlAlphabet / has no duplicates`, () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      equal(urlAlphabet.lastIndexOf(urlAlphabet[i]), i)
    }
  })

  test(`${type} / random / generates small random buffers`, () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      is(random(10).length, 10)
    }
  })

  test(`${type} / random / generates random buffers`, () => {
    let numbers = {}
    let bytes = random(10000)
    is(bytes.length, 10000)
    for (let byte of bytes) {
      if (!numbers[byte]) numbers[byte] = 0
      numbers[byte] += 1
      is(typeof byte, 'number')
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

      let ID1 = nanoid()
      let ID2 = nanoid(makeProxyNumberToReproducePreviousID())

      is.not(ID1, ID2)
    })
  }
}

test.run()
