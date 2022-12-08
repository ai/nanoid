import { is, match, ok } from 'uvu/assert'
import { test } from 'uvu'

import { urlAlphabet } from '../index.js'
import * as browser from '../async/index.browser.js'
import * as node from '../async/index.js'

test.before(() => {
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

test.after(() => {
  Object.defineProperty(global, 'crypto', { value: undefined })
})

function times(size, callback) {
  let array = []
  for (let i = 0; i < size; i++) {
    array.push(1)
  }
  return array.map(callback)
}

for (let type of ['node', 'browser']) {
  let { nanoid, customAlphabet, random } = type === 'node' ? node : browser

  test(`${type} / nanoid / generates URL-friendly IDs`, async () => {
    await Promise.all(
      times(100, async () => {
        let id = await nanoid()
        is(id.length, 21)
        is(typeof id, 'string')
        for (let char of id) {
          match(urlAlphabet, new RegExp(char, 'g'))
        }
      })
    )
  })

  test(`${type} / nanoid / changes ID length`, async () => {
    let id = await nanoid(10)
    is(id.length, 10)
  })

  test(`${type} / nanoid / has no collisions`, async () => {
    let ids = await Promise.all(times(50 * 1000, () => nanoid()))
    ids.reduce((used, id) => {
      is(used[id], undefined)
      used[id] = true
      return used
    }, [])
  })

  test(`${type} / nanoid / has flat distribution`, async () => {
    let COUNT = 100 * 1000
    let LENGTH = (await nanoid()).length

    let chars = {}
    await Promise.all(
      times(COUNT, async () => {
        let id = await nanoid()
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      })
    )
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

  test(`${type} / random / generates small random buffers`, async () => {
    is((await random(10)).length, 10)
  })

  test(`${type} / random / generates random buffers`, async () => {
    let numbers = {}
    let bytes = await random(10000)
    is(bytes.length, 10000)
    for (let byte of bytes) {
      if (!numbers[byte]) numbers[byte] = 0
      numbers[byte] += 1
      is(typeof byte, 'number')
      ok(byte <= 255)
      ok(byte >= 0)
    }
  })

  test(`${type} / customAlphabet / has options`, async () => {
    let nanoidA = customAlphabet('a', 5)
    let id = await nanoidA()
    is(id, 'aaaaa')
  })

  test(`${type} / customAlphabet / has flat distribution`, async () => {
    let COUNT = 50 * 1000
    let LENGTH = 30
    let ALPHABET = 'abcdefghijklmnopqrstuvwxy'
    let nanoid2 = customAlphabet(ALPHABET, LENGTH)

    let chars = {}
    await Promise.all(
      times(100, async () => {
        let id = await nanoid2()
        is(id.length, LENGTH)
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      })
    )
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

  test(`${type} / customAlphabet / changes size`, async () => {
    let nanoidA = customAlphabet('a')
    let id = await nanoidA(10)
    is(id, 'aaaaaaaaaa')
  })
}

test.run()
