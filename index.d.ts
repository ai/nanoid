/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * ```js
 * import { nanoid } from 'nanoid'
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size The number of symbols in ID. Default is 21.
 * @returns Random string.
 */
export function nanoid (size?: number): string

/**
 * Generate secure unique ID with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @returns Random string.
 *
 * ```js
 * const { nanoid2 } = require('nanoid')
 * model.id = nanoid2('0123456789абвгдеё', 5) //=> "8ё56а"
 * ```
 */
export function nanoid2 (alphabet: string, size?: number): string

/**
 * Generate unique ID with custom random generator and alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * ```js
 * import { nanoid3 } from 'nanoid/format'
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * nanoid3(random, "abcdef", 5) //=> "fbaef"
 * ```
 *
 * @param random The random bytes generator.
 * @param alphabet Symbols to be used in new random string.
 * @param size The number of symbols in new random string.
 * @returns Random string.
 */
export function nanoid3 (
  random: (bytes: number) => Uint8Array,
  alphabet: string,
  size?: number
): string

/**
 * URL safe symbols.
 *
 * ```js
 * import { urlAlphabet } from 'nanoid'
 * generate(url, 10) //=> "Uakgb_J5m9"
 * ```
 */
export const urlAlphabet: string

/**
 * Return array with random bytes from hardware random generator.
 *
 * ```js
 * import { nanoid3, random } from 'nanoid'
 * nanoid3(random, "abcdef", 5) //=> "fbaef"
 * ```
 *
 * @param bytes The size of array.
 * @returns Arrays with random bytes.
 */
export function random (bytes: number): Uint8Array
