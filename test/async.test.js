let crypto = require('crypto')

let async = require('../async')
let url = require('../url')

function times (size, callback) {
  let array = []
  for (let i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

function mock (callback) {
  crypto.randomFill = callback
  jest.resetModules()
  async = require('../async')
}

let originFill = crypto.randomFill
afterEach(() => {
  mock(originFill)
})

it('generates URL-friendly IDs', async () => {
  await Promise.all(times(100, async () => {
    let id = await async()
    expect(id).toHaveLength(21)
    expect(typeof id).toEqual('string')
    for (let char of id) {
      expect(url).toContain(char)
    }
  }))
})

it('supports old Node.js', async () => {
  mock(undefined)
  await Promise.all(times(100, async () => {
    let id = await async()
    expect(id).toHaveLength(21)
  }))
})

it('changes ID length', async () => {
  let id = await async(10)
  expect(id).toHaveLength(10)
})

it('accepts string', async () => {
  await expect(async('10')).resolves.toHaveLength(10)
})

it('has no collisions', async () => {
  let ids = await Promise.all(times(100 * 1000, () => async()))
  ids.reduce((used, id) => {
    expect(used[id]).toBeUndefined()
    used[id] = true
    return used
  }, [])
})

it('has flat distribution', async () => {
  let COUNT = 100 * 1000
  let LENGTH = async().length

  let chars = { }
  await Promise.all(times(COUNT, async () => {
    let id = await async()
    for (let char of id) {
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }))
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

it('rejects Promise on error', async () => {
  let error = new Error('test')
  mock((buffer, callback) => {
    callback(error)
  })
  let catched
  try {
    await async()
  } catch (e) {
    catched = e
  }
  expect(catched).toBe(error)
})

it('should cast wrong types to deafults', async () => {
  await expect(async('foobar')).resolves.toHaveLength(21)
  await expect(async({})).resolves.toHaveLength(21)
  await expect(async('10foo')).resolves.toHaveLength(21)
})
