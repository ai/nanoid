var crypto = self.crypto || self.msCrypto

/*
 * This alphabet uses a-z A-Z 0-9 _- symbols.
 * Symbols order was changed for better gzip compression.
 */
var url = 'IUint8Ar21ModulvezGFYPCJ7_p0V4XSymbLBNH6fTqQ35xD9ZREghasOw-cjkWK'

module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  while (size--) {
    id += url[bytes[size] & 63]
  }
  return Promise.resolve(id)
}
