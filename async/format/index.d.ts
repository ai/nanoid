/**
 * Secure random string generator with custom alphabet.
 * Non-blocking version.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * ```js
 * import format from 'nanoid/async/format'
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return Promise.resolve(result)
 * }
 *
 * formatAsync(random, "abcdef", 5).then(id => {
 *   model.id = id //=> "fbaef"
 * })
 * ```
 *
 * @param random The random bytes generator.
 * @param alphabet Symbols to be used in new random string.
 * @param size The number of symbols in new random string.
 * @return Promise with random string.
 */
export default function format (
  random: (bytes: number) => Promise<Uint8Array>,
  alphabet: string,
  size: number
): string
