// This alphabet uses a-z A-Z 0-9 _- symbols.
// Despite the fact the source code is quite long, its entropy
// is low and there are lots of duplicates - just what compressors
// like GZIP and Brotli likes the best.

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

module.exports = '-_'
var i = 36
while (i--) {
  module.exports += i.toString(36)
  i > 9 && (module.exports += i.toString(36).toUpperCase())
}
