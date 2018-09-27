var url = require('./url')
var random = require('./random')

/**
 * Generate secure URL-friendly unique ID. Non-blocking version.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 * @param {function} [callback] for environments without `Promise`.
 *
 * @return {Promise} Promise with random string.
 *
 * @example
 * const nanoidAsync = require('nanoid/async')
 * nanoidAsync.then(id => {
 *   model.id = id
 * })
 *
 * @name async
 * @function
 */
module.exports = function (size, callback) {
  size = size || 21

  var randomPromise = random.async(size)
    .then(function (bytes) {
      var id = ''
      while (0 < size--) {
        id += url[bytes[size] & 63]
      }
      return id
    })

  if (!callback) {
    return randomPromise
  }

  randomPromise
    .then(function (buffer) {
      callback(null, buffer)
    })
    .catch(function (error) {
      callback(error)
    })
}
