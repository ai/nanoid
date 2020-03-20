/**
 * Generate secure URL-friendly unique ID. Non-blocking version.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * ```js
 * import { nanoid } from 'nanoid/async'
 * nanoid().then(id => {
 *   model.id = id
 * })
 * ```
 *
 * @param size The number of symbols in ID. Default is 21.
 * @return Promise with random string.
 */
export function nanoid (size?: number): Promise<string>

/**
 * Low-level function
 * Generate secure unique ID with custom alphabet. Non-blocking version.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @return Promise with random string.
 *
 * ```js
 * const { nanoid2 } = require('nanoid/async')
 * generate('0123456789абвгдеё', 5).then(id => {
 *   model.id = id //=> "8ё56а"
 * })
 * ```
 */
export function nanoid2 (alphabet: string, size?: number): Promise<string>
