// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

/** @module nanoid-deno */

/**
 * This module contains the default functions of Nano ID
 *
 * Nano ID utilizes hardware random byte generation by default for enhanced
 * security and a low collision probability.
 * If security is not a top priority for your use case,
 * you have the option to use the non-secure version designed for environments
 * lacking hardware random generators.
 * Such version can be found in `@qz/nanoid-deno/non_secure`.
 */
export { customAlphabet, customRandom, nanoid, random } from "./src/nanoid.ts";
export { urlAlphabet } from "./src/url_alphabet.ts";
