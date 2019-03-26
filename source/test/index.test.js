var nanoid = require('../')
var url = require('../url')

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

it('has no collisions', function () {
  var used = { }
  for (var i = 0; i < 100 * 1000; i++) {
    var id = nanoid()
    expect(used[id]).not.toBeDefined()
    used[id] = true
  }
})

it('has flat distribution', function () {
  var COUNT = 100 * 1000
  var LENGTH = nanoid().length

  var chars = { }
  for (var i = 0; i < COUNT; i++) {
    var id = nanoid()
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
