var random = require('./random')

var url = '_~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 22 symbols to have same collisions probability
 * as UUID v4.
 *
 * @param {number} [size=22] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * var nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
 *
 * @name nanoid
 */
module.exports = function (size) {
  size = size || 22
  var id = ''
  var bytes = random(size)
  for (var i = 0; i < size; i++) {
    id += url[bytes[i] & 63]
  }
  return id
}
