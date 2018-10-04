var crypto = require('crypto')
var random = require('../async/random')

function mock (callback) {
  crypto.randomFill = callback
  jest.resetModules()
  random = require('../async/random')
}

var originFill = crypto.randomFill
var randomBytes = crypto.randomBytes
afterEach(function () {
  mock(originFill)
  crypto.randomBytes = randomBytes
})

it('generates random buffers', function () {
  return random(10000).then(function (bytes) {
    expect(bytes).toHaveLength(10000)
    var numbers = { }
    for (var i = 0; i < bytes.length; i++) {
      if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
      numbers[bytes[i]] += 1
      expect(typeof bytes[i]).toEqual('number')
      expect(bytes[i]).toBeLessThanOrEqual(255)
      expect(bytes[i]).toBeGreaterThanOrEqual(0)
    }
  })
})

it('supports old Node.js', function () {
  mock(undefined)
  return random(10000).then(function (bytes) {
    expect(bytes).toHaveLength(10000)
    var numbers = { }
    for (var i = 0; i < bytes.length; i++) {
      if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
      numbers[bytes[i]] += 1
      expect(typeof bytes[i]).toEqual('number')
      expect(bytes[i]).toBeLessThanOrEqual(255)
      expect(bytes[i]).toBeGreaterThanOrEqual(0)
    }
  })
})

it('is ready for error', function () {
  var error = new Error('test')
  mock(function (size, callback) {
    callback(error)
  })

  var catched
  return random(10000).catch(function (e) {
    catched = e
  }).then(function () {
    expect(catched).toBe(error)
  })
})

it('is ready for error from old API', function () {
  var error = new Error('test')
  mock(undefined)
  crypto.randomBytes = function (size, callback) {
    callback(error)
  }

  var catched
  return random(10000).catch(function (e) {
    catched = e
  }).then(function () {
    expect(catched).toBe(error)
  })
})
