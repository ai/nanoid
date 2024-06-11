// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// References to the same file (works both for gzip and brotli):
// `'use`, `andom`, and `rict'`
// References to the brotli default dictionary:
// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`

/**
 * URL safe symbols.
 *
 * @example Basic usage
 * ```ts
 * import { urlAlphabet, customAlphabet } from "@qz/nanoid-deno"
 *
 * const nanoid = customAlphabet(urlAlphabet, 10)
 * nanoid() //=> "Uakgb_J5m9"
 * ```
 */
export const urlAlphabet: string =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
