module.exports = function (random, alphabet, size) {
  var mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  var step = -~(1.6 * mask * size / alphabet.length)

  function tick (id) {
    return random(step).then(function (bytes) {
      var i = step
      while (i--) {
        id += alphabet[bytes[i] & mask] || ''
        if (id.length === +size) return id
      }
      return tick(id)
    })
  }

  return tick('')
}
