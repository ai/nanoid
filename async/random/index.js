let crypto = require('crypto')

// `crypto.randomFill()` is a little faster than `crypto.randomBytes()`,
// because it is possible to use in combination with `Buffer.allocUnsafe()`.
let random = bytes =>
  new Promise((resolve, reject) => {
    // `Buffer.allocUnsafe()` is faster because it doesn’t flush the memory.
    // Memory flushing is unnecessary since the buffer allocation itself resets
    // the memory with the new bytes.
    crypto.randomFill(Buffer.allocUnsafe(bytes), (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf)
      }
    })
  })

module.exports = { random }
