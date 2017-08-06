var crypto = window.crypto || window.msCrypto

module.exports = function (bytes) {
  return crypto.getRandomValues(new Uint8Array(bytes))
}
