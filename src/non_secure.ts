// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

import { urlAlphabet } from "./url_alphabet.ts";

/**
 * (non-secure) Generate URL-friendly unique ID.
 *
 * This method uses the non-secure
 * predictable random generator with bigger collision probability.
 *
 * @example Basic Usage
 * ```ts
 * import { nanoid } from '@qz/nanoid-deno/non-secure'
 *
 * const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param {number} size Size of the ID. The default size is 21.
 * @returns {string} A random string.
 */
function nanoid(size: number = 21): string {
  let id = "";
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
}

/**
 * (non-secure) Generate a unique ID based on a custom alphabet.
 *
 * This method uses the non-secure predictable random generator
 * with bigger collision probability.
 *
 * @example Basic Usage
 * ```ts
 * import { customAlphabet } from '@qz/nanoid-deno/non-secure'
 *
 * const nanoid = customAlphabet('0123456789абвгдеё', 5)
 * const id1 = nanoid()  //=> "8ё56а"
 * const id2 = nanoid(8) //=> "7гдб44ё3"
 * ```
 *
 * @param {string} alphabet Alphabet used to generate the ID.
 * @param {number} defaultSize Size of the ID. The default size is `21`.
 * @returns {(size?: number) => string} A random string generator.
 */
function customAlphabet(
  alphabet: string,
  defaultSize: number = 21,
): (size?: number) => string {
  return (size = defaultSize) => {
    let id = "";
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size;
    while (i--) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += alphabet[(Math.random() * alphabet.length) | 0];
    }
    return id;
  };
}

export { customAlphabet, nanoid };
