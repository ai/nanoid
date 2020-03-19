/**
 * Low-level function to change alphabet and ID size.
 * Non-blocking version.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Symbols to be used in ID.
 * @param size The number of symbols in ID. Defauls is 21.
 * @return Promise with random string.
 *
 * ```js
 * const nanoid = require('nanoid/async/generate')
 * generateAsync('0123456789абвгдеё', 5).then(id => {
 *   model.id = id //=> "8ё56а"
 * })
 * ```
 */
export default function generate (
  alphabet: string,
  size?: number
): Promise<string>
