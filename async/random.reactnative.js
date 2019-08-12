var expoRandom

try {
  /* eslint-disable-next-line global-require, node/no-missing-require */
  expoRandom = require('expo-random')
} catch (importError) {}

module.exports = function (bytes) {
  if (!expoRandom) {
    throw new Error(
      'React-Native does not have a built-in secure random generator. ' +
      'Install "expo-random" locally or ' +
      'if you don’t need unpredictable IDs, you can use `nanoid/non-secure`.'
    )
  }

  return expoRandom.getRandomBytesAsync(new Uint8Array(bytes))
}
