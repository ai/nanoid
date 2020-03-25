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
 * @param size The number of symbols in ID.
 * @return Promise with random string.
 *
 * ```js
 * import { customAlphabet } from 'nanoid/async'
 * const nanoid = customAlphabet('0123456789абвгдеё', 5)
 * nanoid().then(id => {
 *   model.id = id //=> "8ё56а"
 * })
 * ```
 */
export function customAlphabet (
  alphabet: string, size: number
): () => Promise<string>

/**
 * Return array with random bytes from hardware random generator.
 *
 * ```js
 * import { random } from 'nanoid/async'
 * random(5).then(bytes => {
 *   bytes //=> [10, 67, 212, 67, 89]
 * })
 * ```
 *
 * @param bytes The size of array.
 * @returns Promise with random bytes.
 */
export function random (bytes: number): Promise<Uint8Array>
