let crypto = require('crypto')

if (crypto.randomFill) {
  // `crypto.randomFill()` is a little fatser than `crypto.randomBytes()`,
  // because we can use faster `Buffer.allocUnsafe()`.
  module.exports = bytes => new Promise((resolve, reject) => {
    // `Buffer.allocUnsafe()` faster because it doesn’t clean memory.
    // We do not need it, since we will fill memory with new bytes anyway.
    crypto.randomFill(Buffer.allocUnsafe(bytes), (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    })
  })
} else {
  module.exports = bytes => new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    })
  })
}
