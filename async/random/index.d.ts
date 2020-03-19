/**
 * Return array with random bytes from hardware random generator.
 * Non-blocking version.
 *
 * ```js
 * import random from 'nanoid/async/random'
 * import format from 'nanoid/async/format'
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 * ```
 *
 * @param bytes The size of array.
 * @returns Promise with array of random bytes.
 */
export default function random (bytes: number): Promise<Uint8Array>
