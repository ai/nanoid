/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * ```js
 * import { nanoid } from 'nanoid/non-secure'
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size The number of symbols in ID. Default is 21.
 * @returns Random string.
 */
export function nanoid (size?: number): string

/**
 * Generate unique ID with custom alphabet. This method use non-secure
 * predictable random generator with bigger collision probability.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @returns Random string.
 *
 * ```js
 * const { nanoid2 } = require('nanoid/non-secure')
 * model.id = generate('0123456789абвгдеё', 5) //=> "8ё56а"
 * ```
 */
export function nanoid2 (alphabet: string, size?: number): string
