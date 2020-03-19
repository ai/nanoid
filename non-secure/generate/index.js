module.exports = (alphabet, size = 21) => {
  let id = ''
  // Complete alternative for `for (var i = 0; i < size; i++)`
  while (size--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += alphabet[Math.random() * alphabet.length | 0]
  }
  return id
}
