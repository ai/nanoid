// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

import { urlAlphabet as scopedUrlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet } from './url-alphabet/index.js'

export let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

export let customRandom = (alphabet, defaultSize, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << Math.log2(alphabet.length - 1)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)

  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
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
