var random = require('../random')

it('generates random buffers', function () {
  var numbers = { }
  var bytes = random(10000)
  expect(bytes).toHaveLength(10000)
  for (var i = 0; i < bytes.length; i++) {
    if (!numbers[bytes[i]]) numbers[bytes[i]] = 0
    numbers[bytes[i]] += 1
    expect(typeof bytes[i]).toEqual('number')
    expect(bytes[i]).toBeLessThanOrEqual(255)
    expect(bytes[i]).toBeGreaterThanOrEqual(0)
  }
})
