var format = require('../format')

it('generates random string', function () {
  var sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  function random (size) {
    var bytes = []
    for (var i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  expect(format(random, 'abcde', 4)).toEqual('cdac')
})
