let crypto = require('crypto')

let random = require('../random')

function mock (callback) {
  crypto.randomFillSync = callback
  jest.resetModules()
  random = require('../random')
}

let originFillSync = crypto.randomFillSync
afterEach(() => {
  mock(originFillSync)
})

it('generates small random buffers', () => {
  expect(random(10)).toHaveLength(10)
})

it('generates random buffers', () => {
  let numbers = { }
  let bytes = random(10000)
  expect(bytes).toHaveLength(10000)
  for (let byte of bytes) {
    if (!numbers[byte]) numbers[byte] = 0
    numbers[byte] += 1
    expect(typeof byte).toEqual('number')
    expect(byte).toBeLessThanOrEqual(255)
    expect(byte).toBeGreaterThanOrEqual(0)
  }
})

it('supports old Node.js', () => {
  mock(undefined)

  let numbers = { }
  let bytes = random(10000)
  expect(bytes).toHaveLength(10000)
  for (let byte of bytes) {
    if (!numbers[byte]) numbers[byte] = 0
    numbers[byte] += 1
    expect(typeof byte).toEqual('number')
    expect(byte).toBeLessThanOrEqual(255)
    expect(byte).toBeGreaterThanOrEqual(0)
  }
})
