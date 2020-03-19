let random
try {
  random = require('expo-random')
} catch (e) {
  throw new Error(
    'React-Native does not have a built-in secure random generator. ' +
    'Install `expo-random` locally or ' +
    'if you don’t need unpredictable IDs, you can use `nanoid/non-secure`.'
  )
}

module.exports = bytes => random.getRandomBytesAsync(bytes)
