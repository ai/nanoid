// This file replaces `async/index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

var crypto = self.crypto || self.msCrypto

// This alphabet uses a-z A-Z 0-9 _- symbols. Symbols order was changed
// for better gzip compression. We use genetic algorithm to find the best order.
// Check generator code at test/alphabet-genetic.
var url = 'IUint8Ar21ModulvezGFYPCJ7_p0V4XSymbLBNH6fTqQ35xD9ZREghasOw-cjkWK'

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
  return Promise.resolve(id)
}
