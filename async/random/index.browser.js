let random = bytes =>
  Promise.resolve(crypto.getRandomValues(new Uint8Array(bytes)))

module.exports = { random }
