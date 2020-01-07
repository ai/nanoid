module.exports = function (random, alphabet, size) {
  // TODO
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // -~i => i + 1 if n is integer number
  // -~f => Math.ceil(f) if n is float number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var i = step
    var bytes = random(i)
    while (i--) {
      id += alphabet[bytes[i] & mask] || ''
      if (id.length === +size) return id
    }
  }
}
