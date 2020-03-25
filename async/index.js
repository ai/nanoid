let crypto = require('crypto')

let { urlAlphabet } = require('..')

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

let customAlphabet = (alphabet, size) => {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  let mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly, because we need to wait
  // for entropy collection. This is why often it will be faster to ask for
  // few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).
  let step = Math.ceil(1.6 * mask * size / alphabet.length)

  let tick = id => random(step).then(bytes => {
    // Compact alternative for `for (var i = 0; i < step; i++)`
    let i = step
    while (i--) {
      // If random byte is bigger than alphabet even after bitmask,
      // we refuse it by `|| ''`.
      id += alphabet[bytes[i] & mask] || ''
      // More compact than `id.length + 1 === size`
      if (id.length === +size) return id
    }
    return tick(id)
  })

  return () => tick('')
}

let nanoid = (size = 21) => random(size).then(bytes => {
  let id = ''
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    id += urlAlphabet[bytes[size] & 63]
  }
  return id
})

module.exports = { nanoid, customAlphabet }
