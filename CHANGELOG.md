# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 5.1.2
* Fixed module docs.

## 5.1.1
* Fixed opaque types support for non-secure generator.
* Added JSR support.

## 5.1.0
* Added opaque types support (by @kossnocorp).

## 5.0.9
* Fixed a way to break Nano ID by passing non-integer size (by @myndzi).

## 5.0.8
* Reduced `customAlphabet` size (by @kirillgroshkov).

## 5.0.7
* Fixed Parcel support (by @WilhelmYakunin).

## 5.0.6
* Fixed React Native support.

## 5.0.5
* Make browser’s version faster by increasing size a little (by Samuel Elgozi).

## 5.0.4
* Fixed CLI docs (by @ilyaboka).

## 5.0.3
* Fixed CLI docs (by Chris Schmich).

## 5.0.2
* Fixed `webcrypto` import (by Divyansh Singh).

## 5.0.1
* Fixed Node.js 18 support.

## 5.0
* Moved Node.js version to Web Crypto API.
* Removed async API since Web Crypto API has only sync version.
* Removed Node.js 14 and 16 support.

## 4.0.2
* Added [link](https://github.com/sponsors/ai) to Github Sponsors.

## 4.0.1
* Reduced npm package size (by @HiChen404).

## 4.0
* Removed CommonJS support. Nano ID 4 will work only with ESM applications.
  We will support 3.x branch with CommonJS for users who can’t migrate to ESM.
* Removed Node.js 10 and Node.js 12 support.
* Reduced npm package size.

## 3.3.8
* Fixed a way to break Nano ID by passing non-integer size (by @myndzi).

## 3.3.7
* Fixed `node16` TypeScript support (by Saadi Myftija).

## 3.3.6
* Fixed package.

## 3.3.5
* Backport funding information.

## 3.3.4
* Fixed `--help` in CLI (by @Lete114).

## 3.3.3
* Reduced size (by Anton Khlynovskiy).

## 3.3.2
* Fixed `enhanced-resolve` support.

## 3.3.1
* Reduced package size.

## 3.3
* Added `size` argument to function from `customAlphabet` (by Stefan Sundin).

## 3.2
* Added `--size` and `--alphabet` arguments to binary (by Vitaly Baev).

## 3.1.32
* Reduced `async` exports size (by Artyom Arutyunyan).
* Moved from Jest to uvu (by Vitaly Baev).

## 3.1.31
* Fixed collision vulnerability on object in `size` (by Artyom Arutyunyan).

## 3.1.30
* Reduced size for project with `brotli` compression (by Anton Khlynovskiy).

## 3.1.29
* Reduced npm package size.

## 3.1.28
* Reduced npm package size.

## 3.1.27
* Cleaned `dependencies` from development tools.

## 3.1.26
* Improved performance (by Eitan Har-Shoshanim).
* Reduced npm package size.

## 3.1.25
* Fixed `browserify` support.

## 3.1.24
* Fixed `browserify` support (by Artur Paikin).

## 3.1.23
* Fixed `esbuild` support.

## 3.1.22
* Added `default` and `browser.default` to `package.exports`.

## 3.1.21
* Reduced npm package size.

## 3.1.20
* Fix ES modules support.

## 3.1.19
* Reduced `customAlphabet` size (by Enrico Scherlies).

## 3.1.18
* Fixed `package.exports`.

## 3.1.17
* Added files without `process`.

## 3.1.16
* Speeded up Nano ID 4 times (by Peter Boyer).

## 3.1.15
* Fixed `package.types` path.

## 3.1.14
* Added `package.types`.

## 3.1.13
* Removed Node.js 15.0.0 with `randomFillSync` regression from `engines.node`.

## 3.1.12
* Improved IE 11 docs.

## 3.1.11
* Fixed asynchronous `customAlphabet` in browser (by @LoneRifle).

## 3.1.10
* Fix ES modules support.

## 3.1.9
* Try to fix React Native Expo support.

## 3.1.8
* Add React Native Expo support.

## 3.1.7
* Clean up code.

## 3.1.6
* Avoid `self` using.

## 3.1.5
* Improve IE docs and warning.

## 3.1.4
* Restrict old Node.js 13 by `engines.node` (by Cansin Yildiz).

## 3.1.3
* Fix ES modules issue with CLI.

## 3.1.2
* Add shebang to CLI.

## 3.1.1
* Fix CLI.

## 3.1
* Add `npx nanoid` CLI.

## 3.0.2
* Fix docs (by Dylan Irlbeck ).

## 3.0.1
* Fix React Native warning on `non-secure` import (by Jia Huang).

## 3.0
**Migration guide:** <https://github.com/ai/nanoid/releases/tag/3.0.0>
* Move to ES2016 syntax. You need to use Babel for IE 11.
* Move to named exports `import { nanoid } from 'nanoid'`.
* Move `import url from 'nanoid/url'` to `import { urlAlphabet } from 'nanoid'`.
* Replace `format()` to `customRandom()`.
* Replace `generate()` to `customAlphabet()`.
* Remove `async/format`.
* Remove React Native support for `nanoid/async`.
* Add `nanoid.js` to use directly in browser from CDN.
* Add TypeScript type definitions.
* Add ES modules support for bundlers, Node.js, and React Native.
* Fix React Native support.
* Reduce size.
* Improve docs (by Dair Aidarkhanov).

## 2.1.11
* Reduce size (by Anton Evzhakov).

## 2.1.10
* Reduce size by 10% (by Anton Khlynovskiy).

## 2.1.9
* Reduce `format` and `async/format` size (by Dair Aidarkhanov).

## 2.1.8
* Improve React docs (by Nahum Zsilva).

## 2.1.7
* Reduce `index`, `async` and `non-secure` size (by @polemius).

## 2.1.6
* Reduce size (by Stas Lashmanov).
* Return fast mask for Node.js.

## 2.1.5
* Reduce size (by Max Graey).
* Fix IE support.

## 2.1.4
* Reduce `generate` size (by Vsevolod Rodionov).
* Reduce `format` and `format` size (by Victor).
* Reduce `async`, `non-secure` and `non-secure/generate` size.
* Speed up `format` and `async/format` (by Max Graey).
* Improve development process on Windows (by Stanislav Lashmanov).

## 2.1.3
* Improve performance (by Stephen Richardson).
* Reduce size (by Stephen Richardson).

## 2.1.2
* Improve docs.

## 2.1.1
* Fix React Native support (by Shawn Hwei).

## 2.1
* Improve React Native support (by Sebastian Werner).

## 2.0.4
* Improve error text for React Native (by Sebastian Werner).

## 2.0.3
* Fix freeze on string in ID length.

## 2.0.2
* Improve docs (by Sylvanus Kateile and Mark Stosberg).

## 2.0.1
* Reduce npm package size.
* Mark package as not having side effects (by @xiaody).

## 2.0
* Use `-` instead of `~` in default alphabet to by file name safe.
* Add `nanoid/non-secure/generate`.

## 1.3.4
* Reduce `non-secure` size.
* Add `async` callback type check.

## 1.3.3
* Fix `nanoid/async` performance regression.
* Fix old Node.js `not seeded` issue in synchronous version too.

## 1.3.2
* Fix random generator `not seeded` issue of old Node.js.

## 1.3.1
* Reduce library size.

## 1.3
* Add `nanoid/async/format` and `nanoid/async/generate`.
* Improve synchronous API performance.
* Reduce `url` size (by Daniil Poroshin).
* Improve React Native docs (by joelgetaction).

## 1.2.6
* Reduce library size (by rqrqrqrq).

## 1.2.5
* Fix Node.js 6.11.1 support (by Andrey Belym).

## 1.2.4
* Speed up Node.js secure generators (by Dmitriy Tsvettsikh).

## 1.2.3
* Fix JSDoc (by Hendry Sadrak).

## 1.2.2
* Fix distribution in `nanoid/non-secure` (by Eatall).

## 1.2.1
* Fix old Node.js support.

## 1.2
* Add `nanoid/async`.
* Fix `nanoid/non-secure` JSDoc.
* Add Chinese documentation (by Wenliang Dai).
* Speed up and reduce size of `nanoid/non-secure` (by Ori Livni).

## 1.1.1
* Improve performance and reduce size of non-secure ID generator.

## 1.1
* Add non-secure ID generator.
* Suggest to use non-secure ID generator for React Native developers.
* Reduce size.

## 1.0.7
* Fix documentation.

## 1.0.6
* Fix documentation.

## 1.0.5
* Reduce `nanoid/index` size (by Anton Khlynovskiy).

## 1.0.4
* Reduce npm package size.

## 1.0.3
* Reduce npm package size.

## 1.0.2
* Fix Web Workers support (by Zachary Golba).

## 1.0.1
* Reduce `nanoid/index` size (by Anton Khlynovskiy).

## 1.0
* Use 21 symbols by default (by David Klebanoff).

## 0.2.2
* Reduce `nanoid/generate` size (by Anton Khlynovskiy).
* Speed up Node.js random generator.

## 0.2.1
* Fix documentation (by Piper Chester).

## 0.2
* Add `size` argument to `nanoid()`.
* Improve performance by 50%.
* Reduce library size by 26% (by Vsevolod Rodionov and Oleg Mokhov).

## 0.1.1
* Reduce library size by 5%.

## 0.1
* Initial release.
