var generate = require('./generate')
var url = require('./url')

/**
 * Generate secure URL-friendly unique ID with same bits length as UUID.
 *
 * @return {string} Random string with 22 URL-friendly symbols.
 *
 * @example
 * var nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
 *
 * @name nanoid
 */
module.exports = function () {
  return generate(url, 22)
}
