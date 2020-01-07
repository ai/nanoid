/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
module.exports = function (random, alphabet, size) {
  // 1. To refuse fewer numbers bitmask is applied
  // 2. It doesn’t solve all problems,
  // because bitmask can reduce big bytes to a number
  // which is close to `Math.pow(x, 2)`
  // e.g. if we have 7 symbols in the alphabet, bitmask will pass 8 anyway
  var mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  // 1. It means how much bytes we generate in one round.
  // Hardware random call generator has a big price
  // because we need to wait for entropy collection
  // Hardware random generator needs entropy only for first random seed,
  // then it generates next bytes by the algorithm.
  // This is why it is cheaper sometimes to ask for more bytes
  // in the round to reduce calls.
  // 2. `1.6` is a selected factor of how many extra bytes it's better to ask
  var step = Math.ceil(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var i = step
    var bytes = random(i)
    while (i--) {
      // '' is to refuse numbers bigger than the alphabet
      id += alphabet[bytes[i] & mask] || ''
      if (id.length === +size) return id
    }
  }
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */
