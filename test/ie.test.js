global.self = {
  msCrypto: {
    getRandomValues (array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

let nanoid = require('../index.browser')

it('generates URL-friendly IDs', () => {
  expect(typeof nanoid()).toEqual('string')
})
