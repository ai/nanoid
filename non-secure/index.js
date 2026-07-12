/* @ts-self-types="./index.d.ts" */

import { urlAlphabet } from '../url-alphabet/index.js'

export let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    // `> 0` stops a negative size from looping forever.
    let i = size | 0
    while (i-- > 0) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}

export let nanoid = (size = 21) => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  // `> 0` stops a negative size from looping forever.
  let i = size | 0
  while (i-- > 0) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
