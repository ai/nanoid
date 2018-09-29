var crypto = require('crypto')

if (crypto.randomFillSync) {
  module.exports = function (bytes) {
    return crypto.randomFillSync(Buffer.allocUnsafe(bytes))
  }
} else {
  module.exports = crypto.randomBytes
}

if (crypto.randomFill) {
  module.exports.async = function (bytes, callback) {
    return crypto.randomFill(Buffer.allocUnsafe(bytes), callback)
  }
} else {
  module.exports.async = crypto.randomBytes
}
