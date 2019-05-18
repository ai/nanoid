var generate = require('../async/generate')

function times (size, callback) {
  var array = []
  for (var i = 0; i < 100; i++) {
    array.push(1)
  }
  return array.map(callback)
}

it('has options', function () {
  return generate('a', 5).then(function (id) {
    expect(id).toEqual('aaaaa')
  })
})

it('accepts string', function () {
  return generate('a', '5').then(function (id) {
    expect(id).toEqual('aaaaa')
  })
})

it('has flat distribution', function () {
  var COUNT = 100 * 1000
  var LENGTH = 5
  var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

  var chars = { }
  return Promise.all(times(100, function () {
    return generate(ALPHABET, LENGTH).then(function (id) {
      expect(id).toHaveLength(LENGTH)
      for (var j = 0; j < id.length; j++) {
        var char = id[j]
        if (!chars[char]) chars[char] = 0
        chars[char] += 1
      }
    })
  })).then(function () {
    expect(Object.keys(chars)).toHaveLength(ALPHABET.length)
    var max = 0
    var min = Number.MAX_SAFE_INTEGER
    for (var k in chars) {
      var distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
      if (distribution > max) max = distribution
      if (distribution < min) min = distribution
    }
    expect(max - min).toBeLessThanOrEqual(0.05)
  })
})
