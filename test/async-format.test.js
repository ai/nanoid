var format = require('../async/format')

it('generates random string', function () {
  var sequence = [2, 255, 0, 1]
  function random (size) {
    var bytes = []
    for (var i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return Promise.resolve(bytes)
  }
  return format(random, 'abc', 4).then(function (id) {
    expect(id).toEqual('cabc')
  })
})
