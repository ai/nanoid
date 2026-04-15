/* @ts-self-types="./index.d.ts" */

// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

import { urlAlphabet as scopedUrlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet } from './url-alphabet/index.js'

export let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

export let customRandom = (alphabet, defaultSize, getRandom) => {
  // Random bytes are 0-255 and already have full entropy.
  // `% alphabet.length` can waste that entropy by making some symbols more likely.
  // `safeByteCutoff` is the exclusive upper bound for unbiased bytes.
  // Bytes below it are safe. Bytes at or above it are rejected.
  //
  // Example: with 17 symbols, `safeByteCutoff` is 255.
  // Bytes 0-254 preserve entropy evenly: each symbol gets 15 source bytes.
  // Byte 255 would map to `0` again, making one symbol slightly more likely.
  // So we reject 255.
  let safeByteCutoff = 256 - (256 % alphabet.length)
  // Note: secure random calls are expensive because system calls for entropy collection take time.
  // To avoid extra calls, extra bytes are requested in advance to cover rejections.
  //
  // `step` determines how many random bytes to request.
  // It depends on ID size and the share of safe bytes (`safeByteCutoff / 256`).
  // `1.6` is a magic number chosen from benchmarks.
  let step = Math.ceil((1.6 * 256 * defaultSize) / safeByteCutoff)

  // Power-of-two alphabets can use `& mask` instead of modulo.
  if (safeByteCutoff === 256) {
    let mask = alphabet.length - 1

    return (size = defaultSize) => {
      if (!size) return ''
      let id = ''
      while (true) {
        let bytes = getRandom(step)
        // A compact alternative for `for (var i = 0; i < step; i++)`.
        let j = step
        while (j--) {
          // Here, `& mask` is equivalent to `% alphabet.length`, but faster
          id += alphabet[bytes[j] & mask]
          if (id.length >= size) return id
        }
      }
    }
  }

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
    // Using the bitwise AND operator to "cap" the value of
    // the random byte from 255 to 63, in that way we can make sure
    // that the value will be a valid index for the "chars" string.
    id += scopedUrlAlphabet[bytes[size] & 63]
  }
  return id
}
