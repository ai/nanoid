let generate = require('../async/generate')

function times (size, callback) {
  let array = []
  for (let i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

it('has options', async () => {
  let id = await generate('a', 5)
  expect(id).toEqual('aaaaa')
})

it('accepts string', async () => {
  let id = await generate('a', '5')
  expect(id).toEqual('aaaaa')
})

it('has flat distribution', async () => {
  let COUNT = 100 * 1000
  let LENGTH = 5
  let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

  let chars = { }
  await Promise.all(times(100, async () => {
    let id = await generate(ALPHABET, LENGTH)
    expect(id).toHaveLength(LENGTH)
    for (let char of id) {
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }))
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
