var random = require('../random')

it('generates random buffers', function () {
  var bytes = random(5)
  expect(bytes.length).toEqual(5)
  for (var i = 0; i < bytes.length; i++) {
    expect(typeof bytes[i]).toEqual('number')
  }
})
