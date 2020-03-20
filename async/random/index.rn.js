let expoRandom = require('expo-random')

let random = bytes => expoRandom.getRandomBytesAsync(bytes)

module.exports = { random }
