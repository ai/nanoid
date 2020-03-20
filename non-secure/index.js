let nanoid2 = (alphabet, size = 21) => {
  let id = ''
  // Complete alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += alphabet[Math.random() * alphabet.length | 0]
  }
  return id
}

let nanoid = (size = 21) => {
  let id = ''
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    let byte = Math.random() * 64 | 0
    if (byte < 36) {
      // 0-9a-z
      id += byte.toString(36)
    } else if (byte < 62) {
      // A-Z
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}

module.exports = { nanoid, nanoid2 }
