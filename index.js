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
  // `|=` convert `bytes` to number to prevent `valueOf` abusing and pool pollution
  fillPool((bytes |= 0))
  return pool.subarray(poolOffset - bytes, poolOffset)
}

export function customRandom(alphabet, defaultSize, getRandom) {
  // `max` is the largest unbiased slice of the 0-255 byte range.
  // If the alphabet size divides 256, every byte is usable.
  // This usually rejects fewer bytes than the original bitmask approach.
  let max = 256 - (256 % alphabet.length)
  // Use a fixed batch size based on the unbiased byte range.
  // `1.6` is a magic number chosen from benchmarks.
  let step = Math.ceil((1.6 * 256 * defaultSize) / max)

  return (size = defaultSize) => {
    if (!size) return ''
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (let i = 0; i < step; i++)`.
      let i = step
      while (i--) {
        if (max === 256) {
          id += alphabet[bytes[i] & (alphabet.length - 1)]
        } else if (bytes[i] < max) {
          id += alphabet[bytes[i] % alphabet.length]
        }
        if (id.length >= size) return id
      }
    }
  }
}

export function customAlphabet(alphabet, size = 21) {
  return customRandom(alphabet, size, random)
}

export function nanoid(size = 21) {
  // `|=` convert `size` to number to prevent `valueOf` abusing and pool pollution
  fillPool((size |= 0))
  let id = ''
  // We are reading directly from the random pool to avoid creating new array
  for (let i = poolOffset - size; i < poolOffset; i++) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unnecessary because
    // the bitmask trims bytes down to the alphabet size.
    id += scopedUrlAlphabet[pool[i] & 63]
  }
  return id
}
