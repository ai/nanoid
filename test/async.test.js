var crypto = require('crypto')

var async = require('../async')
var url = require('../url')

function times (size, callback) {
  var array = []
  for (var i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

var originFill = crypto.randomFill
afterEach(function () {
  crypto.randomFill = originFill

  jest.resetModules()
  async = require('../async') // eslint-disable-line global-require
})

it('generates URL-friendly IDs', function () {
  return Promise.all(times(100, function () {
    return async().then(function (id) {
      expect(id).toHaveLength(21)
      expect(typeof id).toEqual('string')
      for (var j = 0; j < id.length; j++) {
        expect(url).toContain(id[j])
      }
    })
  }))
})

it('changes ID length', function () {
  return async(10).then(function (id) {
    expect(id).toHaveLength(10)
  })
})

it('has no collisions', function () {
  return Promise.all(times(100 * 1000, function () {
    return async()
  })).then(function (ids) {
    ids.reduce(function (used, id) {
      expect(used[id]).not.toBeDefined()
      used[id] = true
      return used
    }, [])
  })
})

it('has flat distribution', function () {
  var COUNT = 100 * 1000
  var LENGTH = async().length

  var chars = { }
  return Promise.all(times(COUNT, function () {
    return async().then(function (id) {
      for (var j = 0; j < id.length; j++) {
        var char = id[j]
        if (!chars[char]) chars[char] = 0
        chars[char] += 1
      }
    })
  })).then(function () {
    expect(Object.keys(chars)).toHaveLength(url.length)
    var max = 0
    var min = Number.MAX_SAFE_INTEGER
    for (var k in chars) {
      var distribution = (chars[k] * url.length) / (COUNT * LENGTH)
      if (distribution > max) max = distribution
      if (distribution < min) min = distribution
    }
    expect(max - min).toBeLessThanOrEqual(0.05)
  })
})

it('rejects Promise on error', function () {
  var error = new Error('test')
  crypto.randomFill = function (buffer, callback) {
    callback(error)
  }

  jest.resetModules()
  async = require('../async') // eslint-disable-line global-require

  return async().catch(function (e) {
    expect(e).toBe(error)
  })
})

it('has callback API', function (done) {
  async(10, function (err, id) {
    expect(id).toHaveLength(10)
    done()
  })
})

it('sends error to callback API', function (done) {
  var error = new Error('test')
  crypto.randomFill = function (buf, callback) {
    callback(error)
  }

  jest.resetModules()
  async = require('../async') // eslint-disable-line global-require

  async(10, function (err, id) {
    expect(err).toBe(error)
    expect(id).toBeUndefined()
    done()
  })
})
