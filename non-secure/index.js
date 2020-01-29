// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for better gzip compression.
// Final url is
// '-_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA'
var url = '-_'

var i = 36
while (i--) {
  // 36 is radix.
  // Number.prototype.toString(36) returns number in Base36 representation.
  // Base36 is like hex,
  // but Base36 is represented using the numerals 0–9 and the Latin letters a-z
  url += i.toString(36)
}

i = 36
// Loop from 36 to 10 (from Z to A in Base36)
while (i-- - 10) {
  url += i.toString(36).toUpperCase()
}

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
  var id = ''
  i = size || 21
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += url[Math.random() * 64 | 0]
  }
  return id
}
