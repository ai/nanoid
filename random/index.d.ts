/**
 * Return array with random bytes from hardware random generator.
 *
 * ```js
 * import random from 'nanoid/random'
 * import format from 'nanoid/format'
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 * ```
 *
 * @param bytes The size of array.
 * @returns Arrays with random bytes.
 */
export default function random (bytes: number): Uint8Array
