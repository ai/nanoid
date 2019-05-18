var nonSecure = require('../non-secure')
var url = require('../url')

it('generates URL-friendly IDs', function () {
  for (var i = 0; i < 10; i++) {
    var id = nonSecure()
    expect(id).toHaveLength(21)
    for (var j = 0; j < id.length; j++) {
      expect(url.indexOf(id[j])).not.toEqual(-1)
    }
  }
})

it('changes ID length', function () {
  expect(nonSecure(10)).toHaveLength(10)
})

it('accepts string', function () {
  expect(nonSecure('10')).toHaveLength(10)
})

it('has no collisions', function () {
  var used = { }
  for (var i = 0; i < 100 * 1000; i++) {
    var id = nonSecure()
    expect(used[id]).not.toBeDefined()
    used[id] = true
  }
})

it('has flat distribution', function () {
  var COUNT = 100 * 1000
  var LENGTH = nonSecure().length

  var chars = { }
  for (var i = 0; i < COUNT; i++) {
    var id = nonSecure()
    for (var j = 0; j < id.length; j++) {
      var char = id[j]
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }

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
