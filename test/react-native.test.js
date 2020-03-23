global.navigator = {
  product: 'ReactNative'
}
global.self = { }

it('tells to use non-secure generator on old browsers', () => {
  expect(() => {
    require('../index.browser')
  }).toThrow(/React Native does not have/)
})
