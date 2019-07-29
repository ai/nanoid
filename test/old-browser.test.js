it('warns to use non-secure generator on old browsers', () => {
  expect(() => {
    require('../index.browser')
  }).toThrowError(/use nanoid\/non-secure/)
})
