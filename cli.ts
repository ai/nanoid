// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

/**
 * You can get unique ID in terminal by calling `deno run @qz/nanoid-deno/cli`.
 * ```ansi
 * $ deno run @qz/nanoid-deno/cli
 * LZfXLFzPPR4NNrgjlWDxn
 * ```
 *
 * Size of generated ID can be specified with `--size` (or `-s`) option:
 * ```ansi
 * $ deno run @qz/nanoid-deno/cli --size 10
 * L3til0JS4z
 * ```
 *
 * Custom alphabet can be specified with `--alphabet` (or `-a`) option
 * (note that in this case `--size` is required):
 * ```ansi
 * $ deno run @qz/nanoid-deno/cli --alphabet abc --size 15
 * bccbcabaabaccab
 * ```
 *
 * @module nanoid-deno/cli */

import "./src/cli.ts";
