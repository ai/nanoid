global.navigator = {
  product: 'ReactNative'
}

it('warns to use non-secure generator on old browsers', () => {
  expect(() => {
    require('../index.browser')
  }).toThrow(/React Native does not have/)
})
