/* @ts-self-types="./index.d.ts" */

// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

import { urlAlphabet as scopedUrlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet } from './url-alphabet/index.js'

export let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

export let customRandom = (alphabet, defaultSize, getRandom) => {
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
        // A compact alternative for `for (var i = 0; i < step; i++)`.
        let j = size
        while (j--) {
          // Here, `& mask` is equivalent to `% alphabet.length`, but faster
          id += alphabet[bytes[j] & mask]
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
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Reject bytes >= `safeByteCutoff` to avoid modulo bias
        // and give each symbol an equal chance.
        if (bytes[j] < safeByteCutoff) {
          id += alphabet[bytes[j] % alphabet.length]
          if (id.length >= size) return id
        }
      }
    }
  }
}

export let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size | 0, random)

export let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array((size |= 0)))
  while (size--) {
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range.
    id += scopedUrlAlphabet[bytes[size] & 63]
  }
  return id
}
