/* eslint-env browser, es5 */
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
  return (
    btoa(
      String.fromCharCode.apply(
        0,
        (window.crypto || window.msCrypto).getRandomValues(
          new Uint8Array(-~size * 0.75)
        )
      )
    )
      .replace(/\+/g, '_')
      .replace(/\//g, '~')
      .slice(0, size)
  )
}
