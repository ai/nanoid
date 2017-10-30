var random = require('./random')

var url = '_~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

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
 * var nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqL"
 *
 * @name nanoid
 */
module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = random(size)

  // `i-- > 0` becomes `i-- >0` when minified
  // `0 < i--` becomes `0<i--`
  // eslint-disable-next-line yoda
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}
