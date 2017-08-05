var url = require('../url')

it('is string', function () {
  expect(typeof url).toEqual('string')
})

it('has no duplicates', function () {
  for (var i = 0; i < url.length; i++) {
    expect(url.lastIndexOf(url[i])).toEqual(i)
  }
})
