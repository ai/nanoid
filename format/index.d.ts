/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * ```js
 * import format from 'nanoid/format'
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 * ```
 *
 * @param random The random bytes generator.
 * @param alphabet Symbols to be used in new random string.
 * @param size The number of symbols in new random string.
 * @returns Random string.
 */
export default function format (
  random: (bytes: number) => Uint8Array,
  alphabet: string,
  size?: number
): string
