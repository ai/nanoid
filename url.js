/**
 * URL safe symbols.
 *
 * @name url
 * @type {string}
 *
 * @example
 * var url = require('nanoid/url')
 * generate(url, 10) //=> "Uakgb_J5m9"
 */
module.exports =
  '_~0123456789' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
