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
