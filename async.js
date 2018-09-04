var crypto = require('crypto')

var url = require('./url')

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
  if (callback) {
    crypto.randomBytes(size, function (err, bytes) {
      if (err) {
        callback(err)
      } else {
        var id = ''
        while (0 < size--) {
          id += url[bytes[size] & 63]
        }
        callback(null, id)
      }
    })
  } else {
    return new Promise(function (resolve, reject) {
      crypto.randomBytes(size, function (err, bytes) {
        if (err) {
          reject(err)
        } else {
          var id = ''
          while (0 < size--) {
            id += url[bytes[size] & 63]
          }
          resolve(id)
        }
      })
    })
  }
}
