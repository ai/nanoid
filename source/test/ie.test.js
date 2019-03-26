global.self = {
  msCrypto: {
    getRandomValues: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

var nanoid = require('../index.browser')

it('generates URL-friendly IDs', function () {
  expect(typeof nanoid()).toEqual('string')
})
