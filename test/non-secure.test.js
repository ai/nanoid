let { test } = require('uvu')
let assert = require('uvu/assert')

let { nanoid, customAlphabet } = require('../non-secure')
let { urlAlphabet } = require('..')

test('nanoid / generates URL-friendly IDs', () => {
  for (let i = 0; i < 10; i++) {
    let id = nanoid()
    assert.is(id.length, 21)
    for (let char of id) {
      assert.match(urlAlphabet, new RegExp(char, "g"))
    }
  }
})

test('nanoid / changes ID length', () => {
  assert.is(nanoid(10).length, 10)
})

test('nanoid / accepts string', () => {
  assert.is(nanoid('10').length, 10)
})

test('nanoid / has no collisions', () => {
  let used = {}
  for (let i = 0; i < 100 * 1000; i++) {
    let id = nanoid()
    assert.is(used[id], undefined)
    used[id] = true
  }
})

test('nanoid / has flat distribution', () => {
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

  assert.is(Object.keys(chars).length, urlAlphabet.length)

  let max = 0
  let min = Number.MAX_SAFE_INTEGER
  for (let k in chars) {
    let distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
    if (distribution > max) max = distribution
    if (distribution < min) min = distribution
  }
  assert.ok(max - min <= 0.05)
})

test('customAlphabet / has options', () => {
  let nanoidA = customAlphabet('a', 5)
  assert.is(nanoidA(), 'aaaaa')
})

test('customAlphabet / has flat distribution', () => {
  let COUNT = 100 * 1000
  let LENGTH = 5
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

  assert.is(Object.keys(chars).length, ALPHABET.length)

  let max = 0
  let min = Number.MAX_SAFE_INTEGER
  for (let k in chars) {
    let distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
    if (distribution > max) max = distribution
    if (distribution < min) min = distribution
  }
  assert.ok(max - min <= 0.05)
})

test.run()
