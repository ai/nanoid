var generate = require('../generate')

it('has options', function () {
  expect(generate('a', 5)).toEqual('aaaaa')
})

it('has flat distribution', function () {
  var COUNT = 100 * 1000
  var LENGTH = 5
  var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

  var chars = { }
  for (var i = 0; i < COUNT; i++) {
    var id = generate(ALPHABET, LENGTH)
    for (var j = 0; j < id.length; j++) {
      var char = id[j]
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }

  for (var k in chars) {
    var distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
    expect(distribution).toBeCloseTo(1, 1)
  }
})
