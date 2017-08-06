/**
 * Secure custom alphabet random generator.
 *
 * Alphabet must contain 256 symbols or less. Otherwise generator
 * will not be secure.
 *
 * @param {generator} random The random number generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * var format = require('nanoid/format')
 *
 * function random (size) {
 *   var result = []
 *   for (var i = 0; i < size; i++) result.push(randomByte())
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 */
module.exports = function (random, alphabet, size) {
  var step = Math.ceil(1.2 * 256 / alphabet.length * size)

  var bytes, byte
  var id = ''
  while (id.length !== size) {
    bytes = random(step)
    for (var i = 0; i < bytes.length; i++) {
      byte = bytes[i]
      if (byte < alphabet.length) {
        id += alphabet[byte]
        if (id.length === size) break
      }
    }
  }

  return id
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */
