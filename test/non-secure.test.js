let { nanoid, nanoid2 } = require('../non-secure')

let { urlAlphabet } = require('..')

describe('nanoid', () => {
  it('generates URL-friendly IDs', () => {
    for (let i = 0; i < 10; i++) {
      let id = nanoid()
      expect(id).toHaveLength(21)
      for (let char of id) {
        expect(urlAlphabet).toContain(char)
      }
    }
  })

  it('changes ID length', () => {
    expect(nanoid(10)).toHaveLength(10)
  })

  it('accepts string', () => {
    expect(nanoid('10')).toHaveLength(10)
  })

  it('has no collisions', () => {
    let used = { }
    for (let i = 0; i < 100 * 1000; i++) {
      let id = nanoid()
      expect(used[id]).toBeUndefined()
      used[id] = true
    }
  })

  it('has flat distribution', () => {
    let COUNT = 100 * 1000
    let LENGTH = nanoid().length

    let chars = { }
    for (let i = 0; i < COUNT; i++) {
      let id = nanoid()
      for (let char of id) {
        if (!chars[char]) chars[char] = 0
        chars[char] += 1
      }
    }

    expect(Object.keys(chars)).toHaveLength(urlAlphabet.length)

    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (let k in chars) {
      let distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
      if (distribution > max) max = distribution
      if (distribution < min) min = distribution
    }
    expect(max - min).toBeLessThanOrEqual(0.05)
  })
})

describe('nanoid2', () => {
  it('has options', () => {
    expect(nanoid2(5, 'a')).toEqual('aaaaa')
  })

  it('has flat distribution', () => {
    let COUNT = 100 * 1000
    let LENGTH = 5
    let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

    let chars = { }
    for (let i = 0; i < COUNT; i++) {
      let id = nanoid2(LENGTH, ALPHABET)
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
})
