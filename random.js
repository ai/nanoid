var crypto = require('crypto')

module.exports = function (bytes) {
  if (!crypto.randomFillSync) {
    return crypto.randomBytes(bytes)
  }

  return crypto.randomFillSync(Buffer.allocUnsafe(bytes))
}

module.exports.async = function (bytes) {
  return new Promise(function (resolve, reject) {
    function callback (error, buffer) {
      error ? reject(error) : resolve(buffer)
    }

    if (crypto.randomFill) {
      crypto.randomFill(Buffer.allocUnsafe(bytes), callback)
    } else {
      crypto.randomBytes(bytes, callback)
    }
  })
}
