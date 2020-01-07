module.exports = function (random, alphabet, size) {
  // 1. To refuse fewer numbers bitmask is applied
  // 2. It doesn’t solve all problems,
  // because bitmask can reduce big bytes to a number
  // which is close to `Math.pow(x, 2)`
  // e.g. if we have 7 symbols in the alphabet, bitmask will pass 8 anyway
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var i = step
    var bytes = random(i)
    while (i--) {
      // '' is to refuse numbers bigger than the alphabet
      id += alphabet[bytes[i] & mask] || ''
      if (id.length === +size) return id
    }
  }
}
