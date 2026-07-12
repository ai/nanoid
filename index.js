import { urlAlphabet } from './url-alphabet/index.js'

export { urlAlphabet }

// `crypto.getRandomValues` rejects requests over 65536 bytes,
// so bigger buffers are filled by chunks.
const GET_RANDOM_LIMIT = 65536

function fillRandom(buffer) {
  let from = 0
  while (from < buffer.length) {
    let to = Math.min(from + GET_RANDOM_LIMIT, buffer.length)
    crypto.getRandomValues(buffer.subarray(from, to))
    from = to
  }
}

export function random(bytes) {
  // `|=` convert `bytes` to number to prevent `valueOf` abusing
  bytes |= 0
  if (bytes < 0) throw new RangeError('Wrong ID size')
  // `random()` is used rarely and not in hot paths, so it makes
  // a direct crypto call instead of using a byte pool.
  let buffer = Buffer.allocUnsafe(bytes)
  fillRandom(buffer)
  return buffer
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

// The string pool optimizations in `customAlphabet()` and `nanoid()`
// were ported from the nope-id project by Orhan Aydoğdu:
// https://github.com/orhanayd/nope-id

// Maximum size of the pre-generated string pool in `customAlphabet()`.
const POOL_MAX = GET_RANDOM_LIMIT / 2

export function customAlphabet(alphabet, defaultSize = 21) {
  if (
    typeof alphabet !== 'string' ||
    !alphabet.length ||
    alphabet.length > 256
  ) {
    return customRandom(alphabet, defaultSize, random)
  }
  for (let i = 0; i < alphabet.length; i++) {
    if (alphabet.charCodeAt(i) > 255) {
      // The fast path below writes char codes to a byte buffer,
      // so it supports only single-byte characters.
      return customRandom(alphabet, defaultSize, random)
    }
  }

  // Alphabet char codes to write IDs into a byte buffer directly.
  let charCodes = Uint8Array.from(alphabet, str => {
    return str.charCodeAt(0)
  })
  let alphabetLen = alphabet.length
  // The smallest `2^n - 1` covering all alphabet indexes. Rejecting
  // `byte & mask >= alphabetLen` avoids modulo bias without `%` operation.
  let mask = (2 << (31 - Math.clz32((alphabetLen - 1) | 1))) - 1

  // IDs are pre-generated into a string pool: accepted alphabet chars are
  // written to a byte buffer, converted to a string with one
  // `Buffer#toString()` call, and every ID is a cheap `String#substring()`.
  // It avoids per-character string concatenations and pays string
  // allocation cost once per refill.
  //
  // The pool starts at the first requested size and grows geometrically,
  // so short-living generators do not pay for a full pool.
  let pool = ''
  let poolOffset = 0
  let poolNext = 0

  return (size = defaultSize) => {
    // `|=` convert `size` to number to prevent `valueOf` abusing
    // and pool offset pollution
    size |= 0
    if (size < 0) throw new RangeError('Wrong ID size')
    if (size === 0) return ''
    if (poolOffset + size > pool.length) {
      let target = Math.max(poolNext, size)
      poolNext = Math.min(target * 16, POOL_MAX)
      let buffer = Buffer.allocUnsafe(target)
      if (mask === alphabetLen - 1) {
        // Power-of-two alphabets like `urlAlphabet` accept every byte,
        // so random bytes are translated in place without rejections.
        fillRandom(buffer)
        for (let i = 0; i < target; i++) {
          buffer[i] = charCodes[buffer[i] & mask]
        }
      } else {
        // Rejection sampling accepts `alphabetLen` of every `mask + 1`
        // random bytes. `1.6` requests extra bytes to cover
        // unlucky streaks in most fills.
        let randomBytes = Buffer.allocUnsafe(
          Math.ceil((1.6 * (mask + 1) * target) / alphabetLen)
        )
        let accepted = 0
        while (accepted < target) {
          fillRandom(randomBytes)
          for (let i = 0; i < randomBytes.length; i++) {
            let index = randomBytes[i] & mask
            if (index < alphabetLen) {
              buffer[accepted++] = charCodes[index]
              if (accepted === target) break
            }
          }
        }
      }
      pool = buffer.toString('latin1')
      poolOffset = 0
    }
    poolOffset += size
    return pool.substring(poolOffset - size, poolOffset)
  }
}

// `nanoid()` reuses the `customAlphabet()` string pool logic.
// The URL-safe alphabet has 64 symbols, so the generator translates
// random bytes in place without rejections.
export const nanoid = customAlphabet(urlAlphabet)
