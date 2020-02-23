// This file replaces `async/random.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

module.exports = bytes => Promise.resolve(
  self.crypto.getRandomValues(new Uint8Array(bytes))
)
