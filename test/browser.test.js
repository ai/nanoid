global.self = {
  crypto: {
    getRandomValues: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

var nanoid = require('../index.browser')
var async = require('../async/index.browser')
var url = require('../url')

function times (size, callback) {
  var array = []
  for (var i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

it('generates URL-friendly IDs', function () {
  for (var i = 0; i < 100; i++) {
    var id = nanoid()
    expect(id).toHaveLength(21)
    expect(typeof id).toEqual('string')
    for (var j = 0; j < id.length; j++) {
      expect(url).toContain(id[j])
    }
  }
})

it('changes ID length', function () {
  expect(nanoid(10)).toHaveLength(10)
})

it('generates IDs with Promise', function () {
  return Promise.all(times(100, function () {
    return async().then(function (id) {
      expect(id).toHaveLength(21)
      expect(typeof id).toEqual('string')
      for (var i = 0; i < id.length; i++) {
        expect(url).toContain(id[i])
      }
    })
  }))
})

it('changes ID length in async', function () {
  return async(10).then(function (id) {
    expect(id).toHaveLength(10)
  })
})
