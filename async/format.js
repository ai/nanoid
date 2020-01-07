/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {asyncGenerator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {Promise} Promise with random string.
 *
 * @example
 * const formatAsync = require('nanoid/async/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return Promise.resolve(result)
 * }
 *
 * formatAsync(random, "abcdef", 5).then(id => {
 *   model.id = id //=> "fbaef"
 * })
 *
 * @name formatAsync
 * @function
 */
module.exports = function (random, alphabet, size) {
  // 1. To refuse fewer numbers bitmask is applied
  // 2. It doesn’t solve all problems,
  // because bitmask can reduce big bytes to a number
  // which is close to `Math.pow(x, 2)`
  // e.g. if we have 7 symbols in the alphabet, bitmask will pass 8 anyway
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  var step = Math.ceil(1.6 * mask * size / alphabet.length)

  function tick (id) {
    return random(step).then(function (bytes) {
      var i = step
      while (i--) {
        // '' is to refuse numbers bigger than the alphabet
        id += alphabet[bytes[i] & mask] || ''
        if (id.length === +size) return id
      }
      return tick(id)
    })
  }

  return tick('')
}

/**
 * @callback asyncGenerator
 * @param {number} bytes The number of bytes to generate.
 * @return {Promise} Promise with array of random bytes.
 */
