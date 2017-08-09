var format = require('./format')
var random = require('./random')
var url = require('./url')

/**
 * Generate secure URL-friendly unique ID.
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
  return format(random, url, 22)
}
