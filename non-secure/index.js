// This alphabet uses a-z A-Z 0-9 _- symbols.
// Despite the fact the source code is quite long, its entropy
// is low and there are lots of duplicates - just what compressors
// like GZIP and Brotli likes the best.
var i
var url = '_-' + String.fromCharCode(
  // ASCII codes for 0...9
  i = 48, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1,

  // ASCII codes for A...Z
  i += 8, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1,

  // ASCII codes for a...z
  i += 7, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1
)

/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * const nanoid = require('nanoid/non-secure')
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 *
 * @name nonSecure
 * @function
 */
module.exports = function (size) {
  size = size || 21
  var id = ''
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += url[Math.random() * 64 | 0]
  }
  return id
}
