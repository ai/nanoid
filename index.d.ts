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
 * model.id = nanoid2(5, '0123456789абвгдеё') //=> "8ё56а"
 * ```
 */
export function nanoid2 (size: number, alphabet: string): string

/**
 * Generate unique ID with custom random generator and alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * ```js
 * import { nanoid3 } from 'nanoid/format'
 *
 * nanoid3(5, "abcdef", size => {
 *   const random = []
 *   for (let i = 0; i < size; i++) {
 *     random.push(randomByte())
 *   }
 *   return random
 * }) //=> "fbaef"
 * ```
 *
 * @param size The number of symbols in new random string.
 * @param alphabet Symbols to be used in new random string.
 * @param random The random bytes generator.
 * @returns Random string.
 */
export function nanoid3 (
  size: number,
  alphabet: string,
  random: (bytes: number) => Uint8Array,
): string

/**
 * URL safe symbols.
 *
 * ```js
 * import { urlAlphabet } from 'nanoid'
 * generate(10, url) //=> "Uakgb_J5m9"
 * ```
 */
export const urlAlphabet: string

/**
 * Return array with random bytes from hardware random generator.
 *
 * ```js
 * import { nanoid3, random } from 'nanoid'
 * nanoid3(5, "abcdef", random) //=> "fbaef"
 * ```
 *
 * @param bytes The size of array.
 * @returns Arrays with random bytes.
 */
export function random (bytes: number): Uint8Array
