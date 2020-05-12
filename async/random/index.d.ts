/**
 * Generate an array of random bytes collected from hardware noise.
 *
 * ```js
 * import { customRandom, random } from 'nanoid'
 * const nanoid = customRandom("abcdef", 5, random)
 * ```
 *
 * @param bytes Size of the array.
 * @returns An array of random bytes.
 */
export function random (bytes: number): Promise<Uint8Array>
