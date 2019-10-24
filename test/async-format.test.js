let format = require('../async/format')
let random = require('../async/random')

it('supports generator', async () => {
  let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  async function customRandom (size) {
    let bytes = []
    for (let i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  expect(await format(customRandom, 'abcde', 4)).toEqual('adca')
  expect(await format(customRandom, 'abcde', 14)).toEqual('cbadcbadcbadcc')
})

it('respects size', async () => {
  expect(await format(random, 'abcde', 4)).toHaveLength(4)
  expect(await format(random, 'abcde', 20)).toHaveLength(20)
})

it('is ready for errors', async () => {
  let error = new Error('test')
  async function brokenRandom () {
    throw error
  }

  let catched
  try {
    await format(brokenRandom, 'abc', 4)
  } catch (e) {
    catched = e
  }
  expect(catched).toBe(error)
})
