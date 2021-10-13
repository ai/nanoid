global.navigator = {
  product: 'ReactNative'
}
global.crypto = {
  getRandomValues(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

let { nanoid } = require('../index.browser')

it('works with polyfill', () => {
  expect(typeof nanoid()).toBe('string')
})
