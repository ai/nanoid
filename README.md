# Nano ID

Very small secure URL-friendly unique ID generator.

```js
var nanoid = require('nanoid')
model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
```

**Safe.** It uses safe native random function and tests symbols distribution.

**Small.** Only 258 bytes (minified and gzipped).

**Compact.** Instead of UUID it uses more symbols (`A-Za-z0-9_~`)
and have same uniqueness in 22 symbols instead of 36.

Generator supports Node.js and [all browsers] from IE 11.

[all browsers]: http://caniuse.com/#feat=getrandomvalues

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Security

*Good article about random generators theory:
[Secure random values (in Node.js)]*

### Unpredictability

Nano ID doesn’t use unsafe `Math.random()`. It use `crypto` module in Node.js
and Web Crypto API in browsers.

### Uniformity

`random % alphabet` is a popular mistake in ID generator. Change to get some
symbols will be lower and it will reduce amount of guesses in bruteforcing.

Nano ID use [better algorithm] and test uniformity:

<img src="distribution.png" alt="Nano ID uniformity" width="340" height="135">

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[better algorithm]: https://github.com/ai/nanoid/blob/master/format.js
