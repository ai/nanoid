module.exports = function (random, alphabet, size) {
  // 1. To refuse fewer numbers bitmask is applied
  // 2. It doesn’t solve all problems,
  // because bitmask can reduce big bytes to a number
  // which is close to `Math.pow(x, 2)`
  // e.g. if we have 7 symbols in the alphabet, bitmask will pass 8 anyway
  var mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  // 1. -~f => Math.ceil(f) if n is float number
  // 2. -~i => i + 1 if n is integer number
  // 3. It means how much bytes we generate in one round.
  // Hardware random call generator has a big price
  // because we need to wait for entropy collection
  // Hardware random generator needs entropy only for first random seed,
  // then it generates next bytes by the algorithm.
  // This is why it is cheaper sometimes to ask for more bytes in the round to reduce calls.
  // 4. `1.6` is a selected factor of how many extra bytes it's better to ask
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
