/* @ts-self-types="./index.d.ts" */

// This file replaces `ulid/index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

import { urlAlphabet } from '../index.js'

// Crockford's Base32 alphabet
export const ulidAlphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

// Encoding lookup table for performance
const ENCODING = Array.from(ulidAlphabet)

// Encode time component (48 bits -> 10 chars)
function encodeTime(timestamp, target, offset) {
  // Use arithmetic operations for proper handling of large numbers
  // Encode from least significant to most significant
  target[offset + 9] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 8] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 7] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 6] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 5] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 4] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 3] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 2] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 1] = ENCODING[timestamp % 32]
  timestamp = Math.floor(timestamp / 32)
  target[offset + 0] = ENCODING[timestamp % 32]
}

// Main ULID generation
export function ulid(len) {
  if (len && len < 26) {
    // Custom length: time prefix + random suffix
    let timestamp = Date.now()
    let timeChars = Math.min(10, Math.floor(len * 0.4))
    let randomChars = len - timeChars
    
    let id = ''
    
    // Encode partial timestamp
    let ts = timestamp
    for (let i = 0; i < timeChars; i++) {
      id += ENCODING[ts % 32]
      ts = Math.floor(ts / 32)
    }
    
    // Add random suffix using nanoid alphabet
    let bytes = crypto.getRandomValues(new Uint8Array(randomChars))
    for (let i = 0; i < randomChars; i++) {
      id += urlAlphabet[bytes[i] & 63]
    }
    
    return id
  }
  
  // Standard 26-character ULID
  let timestamp = Date.now()
  let target = new Array(26)
  
  encodeTime(timestamp, target, 0)
  
  // Get 10 random bytes for 80 bits of randomness
  let randomBytes = crypto.getRandomValues(new Uint8Array(10))
  
  // Encode random component (80 bits -> 16 chars)
  // Process 10 bytes as big-endian for lexicographic sorting
  // Extract 5-bit chunks from most significant to least significant
  
  let charIndex = 10
  let bits = 0
  let bitsCount = 0
  
  // Process bytes in order but extract bits in big-endian fashion
  for (let byteIdx = 0; byteIdx < 10; byteIdx++) {
    // Add byte to accumulator (shift left to make room)
    bits = (bits << 8) | randomBytes[byteIdx]
    bitsCount += 8
    
    // Extract 5-bit chunks from the high bits
    while (bitsCount >= 5) {
      bitsCount -= 5
      target[charIndex++] = ENCODING[(bits >>> bitsCount) & 31]
      bits &= (1 << bitsCount) - 1  // Clear extracted bits
    }
  }
  
  // 80 bits divides evenly into 16 5-bit chars, no remainder possible
  
  return target.join('')
}

// Monotonic factory
export function ulidFactory() {
  let lastTime = 0
  let lastRandom = new Uint8Array(10)
  
  return function monotonic() {
    let now = Date.now()
    let target = new Array(26)
    
    encodeTime(now, target, 0)
    
    if (now === lastTime) {
      // Increment last random
      let carry = 1
      for (let i = 9; i >= 0 && carry > 0; i--) {
        let sum = lastRandom[i] + carry
        lastRandom[i] = sum & 255
        carry = sum >>> 8
      }
    } else {
      crypto.getRandomValues(lastRandom)
      lastTime = now
    }
    
    // Encode incremented random using big-endian
    let charIndex = 10
    let bits = 0
    let bitsCount = 0
    
    // Process bytes in order but extract bits in big-endian fashion
    for (let byteIdx = 0; byteIdx < 10; byteIdx++) {
      // Add byte to accumulator (shift left to make room)
      bits = (bits << 8) | lastRandom[byteIdx]
      bitsCount += 8
      
      // Extract 5-bit chunks from the high bits
      while (bitsCount >= 5) {
        bitsCount -= 5
        target[charIndex++] = ENCODING[(bits >>> bitsCount) & 31]
        bits &= (1 << bitsCount) - 1  // Clear extracted bits
      }
    }
    
    // 80 bits divides evenly into 16 5-bit chars, no remainder possible
    
    return target.join('')
  }
}

// Decode timestamp from ULID
export function decodeTime(id) {
  if (id.length < 10) return 0
  
  let timestamp = 0
  for (let i = 0; i < 10; i++) {
    let char = id[i]
    let value = ulidAlphabet.indexOf(char.toUpperCase())
    if (value === -1) throw new Error('Invalid ULID')
    timestamp = timestamp * 32 + value
  }
  
  return timestamp
}