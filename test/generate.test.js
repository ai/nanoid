var generate = require('../generate')

it('has options', function () {
  expect(generate('a', 5)).toEqual('aaaaa')
})
