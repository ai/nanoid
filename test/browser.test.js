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
let async = require('../async/index.browser')
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
