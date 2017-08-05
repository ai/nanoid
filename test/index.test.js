var nanoid = require('../')
var generate = require('../generate')

it('has URL friendly alphabet', function () {
  expect(typeof nanoid.url).toEqual('string')
})

it('has generate function', function () {
  expect(nanoid.generate).toBe(generate)
})

it('generates URL-friendly IDs', function () {
  var id
  for (var i = 0; i < 10; i++) {
    id = nanoid()
    expect(id.length).toEqual(22)
    for (var j = 0; j < id.length; j++) {
      expect(nanoid.url.indexOf(id[j])).not.toEqual(-1)
    }
  }
})
