it('warns to use non-secure generator on old browsers', () => {
  expect(() => {
    require('../index.browser')
  }).toThrow(/use nanoid\/non-secure/)
})
