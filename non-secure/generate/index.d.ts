/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @returns Random string.
 *
 * ```js
 * const nanoid = require('nanoid/non-secure/generate')
 * model.id = generate('0123456789абвгдеё', 5) //=> "8ё56а"
 * ```
 */
export default function generate (alphabet: string, size: number): string
