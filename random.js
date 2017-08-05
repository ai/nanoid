var randomBytes = require('crypto').randomBytes

module.exports = function (bytes) {
  return randomBytes(bytes)
}
