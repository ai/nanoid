var crypto = require('crypto')

var random = require('../random')

var originFill = crypto.randomFill
var originFillSync = crypto.randomFillSync

afterEach(function () {
  crypto.randomFill = originFill
  crypto.randomFillSync = originFillSync
})

it('generates random buffers (slow & sync)', function () {
  delete crypto.randomFillSync

  var numbers = { }
  var bytes = random(10000)
  expect(bytes).toHaveLength(10000)
  for (var i = 0; i < bytes.length; i++) {
    if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
    numbers[bytes[i]] += 1
    expect(typeof bytes[i]).toEqual('number')
    expect(bytes[i]).toBeLessThanOrEqual(255)
    expect(bytes[i]).toBeGreaterThanOrEqual(0)
  }
})

it('generates random buffers (slow & async)', function () {
  delete crypto.randomFill

  var numbers = { }

  return random.async(10000)
    .then(function (bytes) {
      expect(bytes).toHaveLength(10000)
      for (var i = 0; i < bytes.length; i++) {
        if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
        numbers[bytes[i]] += 1
        expect(typeof bytes[i]).toEqual('number')
        expect(bytes[i]).toBeLessThanOrEqual(255)
        expect(bytes[i]).toBeGreaterThanOrEqual(0)
      }
    })
})

it('generates random buffers (fast & sync)', function () {
  crypto.randomFill = function (buffer) {
    var data = crypto.randomBytes(buffer.length)
    data.copy(buffer)
    return buffer
  }

  var numbers = { }
  var bytes = random(10000)
  expect(bytes).toHaveLength(10000)
  for (var i = 0; i < bytes.length; i++) {
    if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
    numbers[bytes[i]] += 1
    expect(typeof bytes[i]).toEqual('number')
    expect(bytes[i]).toBeLessThanOrEqual(255)
    expect(bytes[i]).toBeGreaterThanOrEqual(0)
  }
})

it('generates random buffers (fast & async)', function () {
  crypto.randomFill = function (buffer, callback) {
    return crypto.randomBytes(buffer.length, function (err, data) {
      if (err) {
        return callback(err)
      }

      data.copy(buffer)
      callback(null, buffer)
    })
  }

  var numbers = { }

  return random.async(10000)
    .then(function (bytes) {
      expect(bytes).toHaveLength(10000)
      for (var i = 0; i < bytes.length; i++) {
        if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
        numbers[bytes[i]] += 1
        expect(typeof bytes[i]).toEqual('number')
        expect(bytes[i]).toBeLessThanOrEqual(255)
        expect(bytes[i]).toBeGreaterThanOrEqual(0)
      }
    })
})

it('passes error from crypto module (sync)', function () {
  var error = new Error('test')
  crypto.randomFillSync = function () {
    throw error
  }

  try {
    random(10000)
  } catch (e) {
    expect(e).toBe(error)
  }
})

it('passes error from crypto module (async)', function () {
  var error = new Error('test')
  crypto.randomFill = function (buffer, callback) {
    callback(error)
  }

  return random.async(10000)
    .catch(function (e) {
      expect(e).toBe(error)
    })
})
