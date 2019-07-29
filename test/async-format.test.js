let format = require('../async/format')

it('generates random string', async () => {
  let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  async function random (size) {
    let bytes = []
    for (let i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  let id = await format(random, 'abcde', 4)
  expect(id).toEqual('cdac')
})

it('is ready for errors', async () => {
  let error = new Error('test')
  async function random () {
    throw error
  }

  let catched
  try {
    await format(random, 'abc', 4)
  } catch (e) {
    catched = e
  }
  expect(catched).toBe(error)
})
