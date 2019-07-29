let nonSecure = require('../non-secure')
let url = require('../url')

it('generates URL-friendly IDs', () => {
  for (let i = 0; i < 10; i++) {
    let id = nonSecure()
    expect(id).toHaveLength(21)
    for (let char of id) {
      expect(url).toContain(char)
    }
  }
})

it('changes ID length', () => {
  expect(nonSecure(10)).toHaveLength(10)
})

it('accepts string', () => {
  expect(nonSecure('10')).toHaveLength(10)
})

it('has no collisions', () => {
  let used = { }
  for (let i = 0; i < 100 * 1000; i++) {
    let id = nonSecure()
    expect(used[id]).toBeUndefined()
    used[id] = true
  }
})

it('has flat distribution', () => {
  let COUNT = 100 * 1000
  let LENGTH = nonSecure().length

  let chars = { }
  for (let i = 0; i < COUNT; i++) {
    let id = nonSecure()
    for (let char of id) {
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }

  expect(Object.keys(chars)).toHaveLength(url.length)

  let max = 0
  let min = Number.MAX_SAFE_INTEGER
  for (let k in chars) {
    let distribution = (chars[k] * url.length) / (COUNT * LENGTH)
    if (distribution > max) max = distribution
    if (distribution < min) min = distribution
  }
  expect(max - min).toBeLessThanOrEqual(0.05)
})
