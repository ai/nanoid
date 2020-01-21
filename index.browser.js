// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in production bundle
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use `nanoid/non-secure`. ' +
      'For secure ID install `expo-random` locally and use `nanoid/async`.'
    )
  }
  if (typeof self === 'undefined' || (!self.crypto && !self.msCrypto)) {
    throw new Error(
      'Your browser does not have secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

var crypto = self.crypto || self.msCrypto

// This alphabet uses a-z A-Z 0-9 _- symbols.
// Despite the fact the source code is quite long, its entropy
// is low and there are lots of duplicates - just what compressors
// like GZIP and Brotli likes the best.
var i
var url = '_-' + String.fromCharCode(
  // ASCII codes for 0...9
  i = 48, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1,

  // ASCII codes for A...Z
  i += 8, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1,

  // ASCII codes for a...z
  i += 7, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1, i += 1,
  i += 1, i += 1
)

module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    id += url[bytes[size] & 63]
  }
  return id
}
