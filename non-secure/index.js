// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// References to the same file (works both for gzip and brotli):
// `'use`, `andom`, and `rict'`
// References to the brotli default dictionary:
// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let urlSafeAlphabet = 
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'

export let customAlphabet = (alphabet = urlAlphabet, defaultSize = 21,url_safe=0) => {
  return (size = defaultSize) => {
    let id = ''
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size | 0
    switch(u){
      case 0:
    while (i--) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    break;
    case 1:
      while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += alphabet[(Math.random() * alphabet.length) | 0]
      }
      id += urlSafeAlphabet[(Math.random() * urlSafeAlphabet.length) | 0];
  }
    
    return id
  }
}

export let nanoid = (size = 21) => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size | 0
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
