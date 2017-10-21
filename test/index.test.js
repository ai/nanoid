var nanoid = require('../')
var url = require('../url')

it('generates URL-friendly IDs', function () {
  for (var i = 0; i < 10; i++) {
    var id = nanoid()
    expect(id.length).toEqual(21)
    for (var j = 0; j < id.length; j++) {
      expect(url.indexOf(id[j])).not.toEqual(-1)
    }
  }
})

it('has no collisions', function () {
  var COUNT = 100 * 1000
  var used = { }
  for (var i = 0; i < COUNT; i++) {
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

  for (var k in chars) {
    var distribution = (chars[k] * url.length) / (COUNT * LENGTH)
    expect(distribution).toBeCloseTo(1, 1)
  }
})
