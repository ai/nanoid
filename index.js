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
  // compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // 1. 63 means last 6 bits
    // 2. there is no need in `|| ''` and `* 1.6` hacks in here,
    // because the default alphabet has 64 symbols in it.
    // 64 is Math.pow(2, 6), the bitmask works perfectly
    // without any bytes bigger than the alphabet
    id += url[bytes[size] & 63]
  }
  return id
}
