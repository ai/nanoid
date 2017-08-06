var format = require('../format')

it('generates random string', function () {
  var bytes = [2, 255, 0, 1]
  function random (size) {
    return bytes.slice(0, size)
  }
  expect(format(random, 'abc', 4)).toEqual('cabc')
})
