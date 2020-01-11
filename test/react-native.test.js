global.navigator = {
  product: 'ReactNative'
}

it('warns to use non-secure generator in ReactNative', () => {
  expect(() => {
    require('../async/random.rn')
  }).toThrow(/React-Native does not have/)
})
