/**
 * URL safe symbols.
 *
 * This alphabet uses a-zA-Z0-9_~ symbols.
 * (Symbols order was changed for better gzip compression.)
 *
 * @name url
 * @type {string}
 *
 * @example
 * const url = require('nanoid/url')
 * generate(url, 10) //=> "Uakgb_J5m9"
 */
module.exports =
  'functio_~0123456789' +
  'abdeghjklmpqrsvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
