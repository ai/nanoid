/**
 * Generate secure URL-friendly unique ID. Non-blocking version.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * ```js
 * import nanoid from 'nanoid/async'
 * nanoid().then(id => {
 *   model.id = id
 * })
 * ```
 *
 * @param size The number of symbols in ID. Default is 21.
 * @return Promise with random string.
 */
export default function nanoid (size?: number): Promise<string>
