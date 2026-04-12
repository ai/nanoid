/* @ts-self-types="./index.d.ts" */

// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

import { urlAlphabet as scopedUrlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet } from './url-alphabet/index.js'

export let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

export let customRandom = (alphabet, defaultSize, getRandom) => {
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
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        if (max === 256) {
          id += alphabet[bytes[j] & (alphabet.length - 1)]
        } else if (bytes[j] < max) {
          id += alphabet[bytes[j] % alphabet.length]
        }
        if (id.length >= size) return id
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
