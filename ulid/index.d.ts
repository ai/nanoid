/**
 * ULID (Universally Unique Lexicographically Sortable Identifier) support
 * for Nano ID. Provides time-based, lexicographically sortable identifiers
 * with hardware random generators.
 *
 * ```js
 * import { ulid } from 'nanoid/ulid'
 * model.id = ulid() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 * ```
 *
 * @module
 */

/**
 * Generate a ULID (Universally Unique Lexicographically Sortable Identifier).
 *
 * By default, generates a standard 26-character ULID consisting of:
 * - 10 characters for timestamp (48 bits)
 * - 16 characters for randomness (80 bits)
 *
 * For custom lengths, generates a hybrid format with:
 * - Time prefix (up to 40% of length)
 * - Random suffix using URL-safe alphabet
 *
 * ```js
 * import { ulid } from 'nanoid/ulid'
 * 
 * // Standard ULID
 * ulid() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 * 
 * // Custom length
 * ulid(10) //=> "01AR9KMHBC"
 * ```
 *
 * @param len Optional custom length. If provided and less than 26,
 *            generates a shorter ID with time prefix and random suffix.
 * @returns A ULID string.
 */
export function ulid(len?: number): string

/**
 * Create a monotonic ULID generator factory.
 *
 * Returns a function that generates ULIDs with guaranteed monotonic ordering
 * within the same millisecond. When called multiple times within the same
 * millisecond, the random component is incremented instead of regenerated.
 *
 * ```js
 * import { ulidFactory } from 'nanoid/ulid'
 * 
 * const generateId = ulidFactory()
 * const id1 = generateId() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 * const id2 = generateId() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAW"
 * // id2 > id1 (lexicographically)
 * ```
 *
 * @returns A monotonic ULID generator function.
 */
export function ulidFactory(): () => string

/**
 * Decode the timestamp from a ULID.
 *
 * Extracts the timestamp (in milliseconds since Unix epoch) encoded
 * in the first 10 characters of a ULID.
 *
 * ```js
 * import { decodeTime } from 'nanoid/ulid'
 * 
 * const id = "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 * const timestamp = decodeTime(id) //=> 1465975560367
 * const date = new Date(timestamp) //=> 2016-06-15T08:46:00.367Z
 * ```
 *
 * @param id The ULID string to decode. Must be at least 10 characters long.
 * @returns The timestamp in milliseconds since Unix epoch.
 * @throws {Error} If the ULID contains invalid characters.
 */
export function decodeTime(id: string): number

/**
 * Crockford's Base32 alphabet used for ULID encoding.
 *
 * This alphabet excludes similar-looking characters (I, L, O, U)
 * to reduce transcription errors.
 *
 * ```js
 * import { ulidAlphabet } from 'nanoid/ulid'
 * ulidAlphabet //=> "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
 * ```
 */
export const ulidAlphabet: string