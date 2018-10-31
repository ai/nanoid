var async = require('../async')

jest.mock('crypto', function () {
  var fixed = false
  return {
    randomBytes: function (size, callback) {
      if (fixed) {
        callback(null, Buffer.allocUnsafe(size))
        fixed = false
      } else {
        setTimeout(function () {
          fixed = true
        }, size)
        callback(new Error('test'))
      }
    }
  }
})

it('tries few time before rejecting', function () {
  return async(10).then(function (id) {
    expect(id).toHaveLength(10)
  })
})

it('throws error after 3 attempts', function () {
  var catched
  return async(60).catch(function (e) {
    catched = e
  }).then(function () {
    expect(catched.message).toEqual('test')
  })
})
