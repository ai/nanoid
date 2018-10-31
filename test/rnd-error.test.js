var async = require('../async')
var sync = require('../')

jest.mock('crypto', function () {
  var fixed = false
  return {
    randomBytes: function (size, callback) {
      if (fixed) {
        if (callback) {
          callback(null, Buffer.allocUnsafe(size))
        } else {
          return Buffer.allocUnsafe(size)
        }
        fixed = false
      } else {
        if (size === 1) {
          fixed = true
        } else {
          setTimeout(function () {
            fixed = true
          }, size)
        }
        if (callback) {
          callback(new Error('test'))
        } else {
          throw new Error('test')
        }
      }
    }
  }
})

it('tries few time before rejecting in sync', function () {
  expect(sync(1)).toHaveLength(1)
})

it('tries few time before rejecting in async', function () {
  return async(10).then(function (id) {
    expect(id).toHaveLength(10)
  })
})

it('throws error after 3 attempts in sync', function () {
  expect(function () {
    sync(60)
  }).toThrow('test')
})

it('throws error after 3 attempts in async', function () {
  var catched
  return async(60).catch(function (e) {
    catched = e
  }).then(function () {
    expect(catched.message).toEqual('test')
  })
})
