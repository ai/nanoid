let format = require('../format')
let random = require('../random')

it('supports generator', () => {
  let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
  function customRandom (size) {
    let bytes = []
    for (let i = 0; i < size; i += sequence.length) {
      bytes = bytes.concat(sequence.slice(0, size - i))
    }
    return bytes
  }
  expect(format(customRandom, 'abcde', 4)).toEqual('adca')
  expect(format(customRandom, 'abcde', 18)).toEqual('cbadcbadcbadcbadcc')
})

it('respects size', () => {
  expect(format(random, 'abcde', 4)).toHaveLength(4)
  expect(format(random, 'abcde', 20)).toHaveLength(20)
})
