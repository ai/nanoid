var crypto = self.crypto || self.msCrypto

var url = '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ'

module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return Promise.resolve(id)
}
