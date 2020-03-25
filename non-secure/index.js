let { urlAlphabet } = require('..')

let customAlphabet = (alphabet, size) => {
  return () => {
    let id = ''
    // Complete alternative for `for (var i = 0; i < size; i++)`
    let i = size
    while (i--) {
      // `| 0` is compact and faster alternative for `Math.floor()`
      id += alphabet[Math.random() * alphabet.length | 0]
    }
    return id
  }
}

let nanoid = (size = 21) => {
  let id = ''
  // Complete alternative for `for (var i = 0; i < size; i++)`
  let i = size
  while (i--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += urlAlphabet[Math.random() * 64 | 0]
  }
  return id
}

module.exports = { nanoid, customAlphabet }
