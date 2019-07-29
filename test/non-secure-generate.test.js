let generate = require('../non-secure/generate')

it('has options', () => {
  expect(generate('a', 5)).toEqual('aaaaa')
})

it('accepts string', () => {
  expect(generate('a', '5')).toEqual('aaaaa')
})

it('has flat distribution', () => {
  let COUNT = 100 * 1000
  let LENGTH = 5
  let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

  let chars = { }
  for (let i = 0; i < COUNT; i++) {
    let id = generate(ALPHABET, LENGTH)
    for (let char of id) {
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }

  expect(Object.keys(chars)).toHaveLength(ALPHABET.length)

  let max = 0
  let min = Number.MAX_SAFE_INTEGER
  for (let k in chars) {
    let distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
    if (distribution > max) max = distribution
    if (distribution < min) min = distribution
  }
  expect(max - min).toBeLessThanOrEqual(0.05)
})
