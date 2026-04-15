import { webcrypto as crypto } from 'node:crypto'

import { urlAlphabet as scopedUrlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet } from './url-alphabet/index.js'

// It is best to make fewer, larger requests to the crypto module to
// avoid system call overhead. So, random numbers are generated in a
// pool. The pool is a Buffer that is larger than the initial random
// request size by this multiplier. The pool is enlarged if subsequent
// requests exceed the maximum buffer size.
const POOL_SIZE_MULTIPLIER = 128
let pool, poolOffset

function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)
    crypto.getRandomValues(pool)
    poolOffset = 0
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool)
    poolOffset = 0
  }
  poolOffset += bytes
}

export function random(bytes) {
  // `|=` convert `bytes` to number to prevent `valueOf` abusing
  // and pool pollution
  fillPool((bytes |= 0))
  return pool.subarray(poolOffset - bytes, poolOffset)
}

export function customRandom(alphabet, defaultSize, getRandom) {
  // Random bytes are 0-255. `random % alphabet.length` can waste
  // that entropy by making some symbols more likely.
  //
  // `safeByteCutoff` will be divided by `alphabet.length` without remainder
  // fixing issue of broken distribution.
  //
  // Example: with 17 symbols, `safeByteCutoff` is 255.
  // Bytes 0-254 preserve entropy evenly: each symbol gets 15 source bytes.
  // Byte 255 would map to `0` again, making one symbol slightly more likely.
  // So we reject 255.
  let safeByteCutoff = 256 - (256 % alphabet.length)

  // Power-of-two alphabets can use `& mask` instead of modulo.
  if (safeByteCutoff === 256) {
    let mask = alphabet.length - 1

    return (size = defaultSize) => {
      if (!size) return ''
      let id = ''
      while (true) {
        let bytes = getRandom(size)
        // A compact alternative for `for (let i = 0; i < step; i++)`.
        let i = size
        while (i--) {
          // Here, `& mask` is equivalent to `% alphabet.length`, but faster
          id += alphabet[bytes[i] & mask]
          if (id.length >= size) return id
        }
      }
    }
  }

  // Secure random calls are expensive because system calls
  // for entropy collection take time. To avoid extra calls,
  // extra bytes are requested in advance to cover rejections.
  //
  // `step` determines how many random bytes to request.
  // `1.6` is a magic number chosen from benchmarks.
  let step = Math.ceil((1.6 * 256 * defaultSize) / safeByteCutoff)

  return (size = defaultSize) => {
    if (!size) return ''
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (let i = 0; i < step; i++)`.
      let i = step
      while (i--) {
        // Reject bytes >= `safeByteCutoff` to avoid modulo bias
        // and give each symbol an equal chance.
        if (bytes[i] < safeByteCutoff) {
          id += alphabet[bytes[i] % alphabet.length]
          if (id.length >= size) return id
        }
      }
    }
  }
}

export function customAlphabet(alphabet, size = 21) {
  return customRandom(alphabet, size, random)
}

export function nanoid(size = 21) {
  // `|=` convert `size` to number to prevent `valueOf` abusing
  // and pool pollution
  fillPool((size |= 0))

  let id = ''
  // We are reading directly from the random pool to avoid creating new array
  for (let i = poolOffset - size; i < poolOffset; i++) {
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range.
    id += scopedUrlAlphabet[pool[i] & 63]
  }
  return id
}
