global.self = {
  crypto: {
    getRandomValues: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

var nanoid = require('../index.browser')
var url = require('../url')

it('generates URL-friendly IDs', function () {
  for (var i = 0; i < 100; i++) {
    var id = nanoid()
    expect(id).toHaveLength(21)
    expect(typeof id).toEqual('string')
    for (var j = 0; j < id.length; j++) {
      expect(url).toContain(id[j])
    }
  }
})
