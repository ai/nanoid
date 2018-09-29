var crypto = require('crypto')

if (crypto.randomFillSync) {
  module.exports = function (bytes) {
    return crypto.randomFillSync(Buffer.allocUnsafe(bytes))
  }
} else {
  module.exports = crypto.randomBytes
}
