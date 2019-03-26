it('warns to use non-secure generator on old browsers', function () {
  expect(function () {
    // eslint-disable-next-line global-require
    require('../index.browser')
  }).toThrowError(/use nanoid\/non-secure/)
})
