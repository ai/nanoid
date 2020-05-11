global.msCrypto = {}

it('shows error in IE', () => {
  expect(() => {
    require('../index.browser')
  }).toThrow(/IE 11/)
})
