// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

import { urlAlphabet } from "./url_alphabet.ts";

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, the ID will have 21 symbols to have a collision probability
 * similar to UUID v4.
 *
 * @example Basic Usage
 * ```ts
 * import { nanoid } from '@qz/nanoid-deno'
 * const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param {number} size Size of the ID. The default size is 21.
 * @returns {string} A random string.
 */
function nanoid(size: number = 21): string {
  // `-=` convert `size` to number to prevent `valueOf` abusing
  fillPool(size -= 0);
  let id: string = "";
  // We are reading directly from the random pool to avoid creating new array
  for (let i = poolOffset - size; i < poolOffset; i++) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unnecessary because
    // the bitmask trims bytes down to the alphabet size.
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}

/**
 * Generate secure unique ID with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @example Basic Usage
 * ```ts
 * import { customAlphabet } from "@qz/nanoid-deno"
 *
 * const nanoid = customAlphabet('0123456789абвгдеё', 5)
 * nanoid() //=> "8ё56а"
 * ```
 *
 * @param {string} alphabet Alphabet used to generate the ID.
 * @param {number} size Size of the ID. The default size is `21`.
 * @returns {(size?: number) => string} A random string generator.
 */
function customAlphabet(
  alphabet: string,
  size: number = 21,
): (size?: number) => string {
  return customRandom(alphabet, size, random);
}

/**
 * Generate unique ID with custom random generator and alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @example Basic Usage
 * ```ts
 * import { customRandom } from "@qz/nanoid-deno"
 *
 * function randomByte() {
 *  // Your random bytes generator
 * }
 *
 * const nanoid = customRandom('abcdef', 5, size => {
 *   const random = []
 *   for (let i = 0; i < size; i++) {
 *     random.push(randomByte())
 *   }
 *   return random
 * })
 *
 * nanoid() //=> "fbaef"
 * ```
 *
 * @param {string} alphabet Alphabet used to generate a random string.
 * @param {number} defaultSize The size of the random string.
 * @param {(bytes: number) => Uint8Array} getRandom A random bytes generator.
 * @returns {(size?: number) => string} A random string generator.
 */
function customRandom(
  alphabet: string,
  defaultSize: number,
  getRandom: (bytes: number) => Uint8Array,
): (size?: number) => string {
  if (isNaN(defaultSize)) {
    throw new Deno.errors.InvalidData(
      "Invalid default size: 'NaN'. Please provide a valid number for the default size.",
    );
  }

  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  const mask: number = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;

  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).
  const step: number = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size: number = defaultSize): string => {
    let id = "";
    while (true) {
      const bytes = getRandom(step);
      // A compact alternative for `for (let i = 0; i < step; i++)`.
      let i = step;
      while (i--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[i] & mask] || "";
        if (id.length === size) return id;
      }
    }
  };
}

/**
 * Generate an array of random bytes collected from hardware noise.
 *
 * @example Basic Usage
 * ```ts
 * import { customRandom, random } from "@qz/nanoid-deno"
 *
 * const nanoid = customRandom("abcdef", 5, random)
 * const id = nanoid() //=> ibdfg
 * ```
 *
 * @param {number} bytes Size of the array.
 * @returns {Uint8Array} An array of random bytes.
 */
function random(bytes: number): Uint8Array {
  // `-=` convert `bytes` to number to prevent `valueOf` abusing
  fillPool(bytes -= 0);
  return pool.subarray(poolOffset - bytes, poolOffset);
}

// It is best to make fewer, larger requests to the crypto module to
// avoid system call overhead. So, random numbers are generated in a
// pool. The pool is a Buffer that is larger than the initial random
// request size by this multiplier. The pool is enlarged if subsequent
// requests exceed the maximum buffer size.
const POOL_SIZE_MULTIPLIER = 128;
let pool: Uint8Array, poolOffset: number;

function fillPool(bytes: number): void {
  if (!pool || pool.length < bytes) {
    pool = new Uint8Array(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}

export { customAlphabet, customRandom, nanoid, random };
