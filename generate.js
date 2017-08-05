var random = require('./random')
var format = require('./format')

/**
 * Low-level function to change alphabet and ID size.
 *
 * Alphabet must contain 256 symbols or less. Otherwise generator
 * will not be secure.
 *
 * @param {string} alphabet String with chars for ID.
 * @param {number} size Chars count in new ID.
 *
 * @return {string} Unique ID.
 *
 * @example
 * var generate = require('nanoid/generate')
 * model.id = generate('0123456789абвгдеё', 5) //=> "8ё56а"
 */
module.exports = function (alphabet, size) {
  return format(random, alphabet, size)
}
