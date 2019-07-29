let crypto = require('crypto')

let random = require('../async/random')

function mock (callback) {
  crypto.randomFill = callback
  jest.resetModules()
  random = require('../async/random')
}

let originFill = crypto.randomFill
let randomBytes = crypto.randomBytes
afterEach(() => {
  mock(originFill)
  crypto.randomBytes = randomBytes
})

it('generates random buffers', async () => {
  let bytes = await random(10000)
  expect(bytes).toHaveLength(10000)
  let numbers = { }
  for (let byte of bytes) {
    if (!numbers[byte]) numbers[byte] = 0
    numbers[byte] += 1
    expect(typeof byte).toEqual('number')
    expect(byte).toBeLessThanOrEqual(255)
    expect(byte).toBeGreaterThanOrEqual(0)
  }
})

it('supports old Node.js', async () => {
  mock(undefined)
  let bytes = await random(10000)
  expect(bytes).toHaveLength(10000)
  let numbers = { }
  for (let byte of bytes) {
    if (!numbers[byte]) numbers[byte] = 0
    numbers[byte] += 1
    expect(typeof byte).toEqual('number')
    expect(byte).toBeLessThanOrEqual(255)
    expect(byte).toBeGreaterThanOrEqual(0)
  }
})

it('is ready for error', async () => {
  let error = new Error('test')
  mock((size, callback) => {
    callback(error)
  })

  let catched
  try {
    await random(10000)
  } catch (e) {
    catched = e
  }
  expect(catched).toBe(error)
})

it('is ready for error from old API', async () => {
  let error = new Error('test')
  mock(undefined)
  crypto.randomBytes = function (size, callback) {
    callback(error)
  }

  let catched
  try {
    await random(10000)
  } catch (e) {
    catched = e
  }
  expect(catched).toBe(error)
})
