// This alphabet uses a-z A-Z 0-9 _- symbols.
// Despite the fact the source code is quite long, its entropy
// is low and there are lots of duplicates - just what compressors
// like GZIP and Brotli likes the best.

var i

/**
 * URL safe symbols.
 *
 * @name url
 * @type {string}
 *
 * @example
 * const url = require('nanoid/url')
 * generate(url, 10) //=> "Uakgb_J5m9"
 */
module.exports = '_-' + String.fromCharCode(
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
