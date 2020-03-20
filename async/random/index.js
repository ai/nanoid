let crypto = require('crypto')

// `crypto.randomFill()` is a little faster than `crypto.randomBytes()`,
// because we can use faster `Buffer.allocUnsafe()`.
let random = bytes => new Promise((resolve, reject) => {
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

module.exports = { random }
