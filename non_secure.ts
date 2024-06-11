// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

/** @module nanoid-deno/non_secure */

/**
 * This module contains the **NON-secure** functions of Nano ID.
 *
 * By default, Nano ID uses hardware random byte generation for security and low
 * collision probability, which is available in `@qz/nanoid-deno`.
 * If you are not highly concerned with security, you can use this non-secure
 * version for environments without hardware random generators.
 */
export { customAlphabet, nanoid } from "./src/non_secure.ts";
