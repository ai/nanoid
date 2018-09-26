var crypto = require('crypto')

module.exports = function (bytes) {
  var buffer = Buffer.allocUnsafe(bytes)
  crypto.randomFillSync(buffer)

  return buffer
}
