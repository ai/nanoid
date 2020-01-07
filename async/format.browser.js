module.exports = function (random, alphabet, size) {
  // TODO
  var mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)

  function tick (id) {
    return random(step).then(function (bytes) {
      var i = step
      while (i--) {
        // '' is to refuse numbers bigger than the alphabet
        id += alphabet[bytes[i] & mask] || ''
        if (id.length === +size) return id
      }
      return tick(id)
    })
  }

  return tick('')
}
