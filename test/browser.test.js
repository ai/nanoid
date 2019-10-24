global.self = {
  crypto: {
    getRandomValues (array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

let nanoid = require('../index.browser')
let format = require('../format.browser')
let random = require('../random.browser')
let async = require('../async/index.browser')
let asyncFormat = require('../async/format.browser')
let asyncRandom = require('../async/random.browser')
let url = require('../url')

function times (size, callback) {
  let array = []
  for (let i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

it('generates URL-friendly IDs', () => {
  for (let i = 0; i < 100; i++) {
    let id = nanoid()
    expect(id).toHaveLength(21)
    expect(typeof id).toEqual('string')
    for (let char of id) {
      expect(url).toContain(char)
    }
  }
})

it('changes ID length', () => {
  expect(nanoid(10)).toHaveLength(10)
})

it('supports generator', () => {
  let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  function customRandom (size) {
    let bytes = []
    for (let i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  expect(format(customRandom, 'abcde', 4)).toEqual('adca')
  expect(format(customRandom, 'abcde', 20)).toEqual('dcbadcbadcbadcbadcdc')
})

it('respects size', () => {
  expect(format(random, 'abcde', 4)).toHaveLength(4)
  expect(format(random, 'abcde', 20)).toHaveLength(20)
})

it('generates IDs with Promise', async () => {
  await Promise.all(times(100, async () => {
    let id = await async()
    expect(id).toHaveLength(21)
    expect(typeof id).toEqual('string')
    for (let char of id) {
      expect(url).toContain(char)
    }
  }))
})

it('changes ID length in async', async () => {
  let id = await async(10)
  expect(id).toHaveLength(10)
})

it('supports async generator', async () => {
  let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  async function customRandom (size) {
    let bytes = []
    for (let i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  expect(await asyncFormat(customRandom, 'abcde', 4)).toEqual('adca')
  expect(await asyncFormat(customRandom, 'abcde', 14)).toEqual('cbadcbadcbadcc')
})

it('respects size for async', async () => {
  expect(await asyncFormat(asyncRandom, 'abcde', 4)).toHaveLength(4)
  expect(await asyncFormat(asyncRandom, 'abcde', 20)).toHaveLength(20)
})
