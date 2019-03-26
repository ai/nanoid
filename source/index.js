var random = require('./random')
var url = require('./url')

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * const nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 *
 * @name nanoid
 * @function
 */
module.exports = function (size) {
  size = size || 21
  var bytes = random(size)
  var id = ''
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}
