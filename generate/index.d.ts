/**
 * Low-level function to change alphabet and ID size.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @returns Random string.
 *
 * ```js
 * const nanoid = require('nanoid/generate')
 * model.id = generate('0123456789абвгдеё', 5) //=> "8ё56а"
 * ```
 */
export default function generate (alphabet: string, size?: number): string
