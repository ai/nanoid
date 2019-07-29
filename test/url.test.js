let url = require('../url')

it('is string', () => {
  expect(typeof url).toEqual('string')
})

it('has no duplicates', () => {
  for (let i = 0; i < url.length; i++) {
    expect(url.lastIndexOf(url[i])).toEqual(i)
  }
})
