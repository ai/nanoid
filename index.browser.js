// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in production bundle
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    !self.crypto
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use `nanoid/non-secure`. ' +
      'For secure IDs import `react-native-get-random-values` before Nano ID.'
    )
  }
  if (typeof self !== 'undefined' && self.msCrypto && !self.crypto) {
    throw new Error(
      'Add self.crypto = self.msCrypto before Nano ID to fix IE 11 support'
    )
  }
  if (typeof self === 'undefined' || !self.crypto) {
    throw new Error(
      'Your browser does not have secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

// This alphabet uses a-z A-Z 0-9 _- symbols. Symbols order was changed
// for better gzip compression. We use genetic algorithm to find the best order.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

// // This alphabet uses a-z A-Z 0-9 _- symbols.
// // Symbols are generated for smaller size.
// // -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
// let urlAlphabet = '-_'
// // Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
// let i = 36
// while (i--) {
//   // 36 is radix. Number.prototype.toString(36) returns number
//   // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
//   urlAlphabet += i.toString(36)
// }
// // Loop from 36 to 10 (from Z to A in Base36).
// i = 36
// while (i-- - 10) {
//   urlAlphabet += i.toString(36).toUpperCase()
// }

let random = bytes => self.crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  // We do not use faster Math.clz32, because it is not available in browsers.
  let mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly, because we need to wait
  // for entropy collection. This is why often it will be faster to ask for
  // few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).

  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  let step = -~(1.6 * mask * size / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // Compact alternative for `for (var j = 0; j < step; j++)`
      let j = step
      while (j--) {
        // If random byte is bigger than alphabet even after bitmask,
        // we refuse it by `|| ''`.
        id += alphabet[bytes[j] & mask] || ''
        // More compact than `id.length + 1 === size`
        if (id.length === +size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = self.crypto.getRandomValues(new Uint8Array(size))

  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // 0-9a-z
      id += byte.toString(36)
    } else if (byte < 62) {
      // A-Z
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
    // id += urlAlphabet[bytes[i] & 63]
  }
  return id
}

module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }
