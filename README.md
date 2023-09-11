# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

**English** | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md)

A tiny, secure, URL-friendly, unique string ID generator for JavaScript.

> “An amazing level of senseless perfectionism,
> which is simply impossible not to respect.”

* **Small.** 130 bytes (minified and gzipped). No dependencies.
  [Size Limit] controls the size.
* **Safe.** It uses hardware random generator. Can be used in clusters.
* **Short IDs.** It uses a larger alphabet than UUID (`A-Za-z0-9_-`).
  So ID size was reduced from 36 to 21 symbols.
* **Portable.** Nano ID was ported
  to over [20 programming languages](./README.md#other-programming-languages).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Supports modern browsers, IE [with Babel], Node.js and React Native.

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[with Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Table of Contents

* [Comparison with UUID](#comparison-with-uuid)
* [Benchmark](#benchmark)
* [Security](#security)
* [Install](#install)
* [API](#api)
  * [Blocking](#blocking)
  * [Non-Secure](#non-secure)
  * [Custom Alphabet or Size](#custom-alphabet-or-size)
  * [Custom Random Bytes Generator](#custom-random-bytes-generator)
* [Usage](#usage)
  * [React](#react)
  * [React Native](#react-native)
  * [PouchDB and CouchDB](#pouchdb-and-couchdb)
  * [Web Workers](#web-workers)
  * [Jest](#jest)
  * [CLI](#cli)
  * [Other Programming Languages](#other-programming-languages)
* [Tools](#tools)


## Comparison with UUID

Nano ID is quite comparable to UUID v4 (random-based).
It has a similar number of random bits in the ID
(126 in Nano ID and 122 in UUID), so it has a similar collision probability:

> For there to be a one in a billion chance of duplication,
> 103 trillion version 4 IDs must be generated.

There are two main differences between Nano ID and UUID v4:

1. Nano ID uses a bigger alphabet, so a similar number of random bits
   are packed in just 21 symbols instead of 36.
2. Nano ID code is **4 times smaller** than `uuid/v4` package:
   130 bytes instead of 423.


## Benchmark

```rust
$ node ./test/benchmark.js
crypto.randomUUID         21,119,429 ops/sec
uuid v4                   20,368,447 ops/sec
@napi-rs/uuid             11,493,890 ops/sec
uid/secure                 8,409,962 ops/sec
@lukeed/uuid               6,871,405 ops/sec
nanoid                     5,652,148 ops/sec
customAlphabet             3,565,656 ops/sec
secure-random-string         394,201 ops/sec
uid-safe.sync                393,176 ops/sec
shortid                       49,916 ops/sec

Non-secure:
uid                       58,860,241 ops/sec
nanoid/non-secure          2,744,615 ops/sec
rndm                       2,718,063 ops/sec
```

Test configuration: ThinkPad X1 Carbon Gen 9, Fedora 36, Node.js 18.9.


## Security

*See a good article about random generators theory:
[Secure random values (in Node.js)]*

* **Unpredictability.** Instead of using the unsafe `Math.random()`, Nano ID
  uses the `crypto` module in Node.js and the Web Crypto API in browsers.
  These modules use unpredictable hardware random generator.
* **Uniformity.** `random % alphabet` is a popular mistake to make when coding
  an ID generator. The distribution will not be even; there will be a lower
  chance for some symbols to appear compared to others. So, it will reduce
  the number of tries when brute-forcing. Nano ID uses a [better algorithm]
  and is tested for uniformity.

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

* **Well-documented:** all Nano ID hacks are documented. See comments
  in [the source].
* **Vulnerabilities:** to report a security vulnerability, please use
  the [Tidelift security contact](https://tidelift.com/security).
  Tidelift will coordinate the fix and disclosure.

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[better algorithm]:                  https://github.com/ai/nanoid/blob/main/index.js
[the source]:                        https://github.com/ai/nanoid/blob/main/index.js


## Install

```bash
npm install --save nanoid
```

Nano ID 4 works only with ESM projects, in tests or Node.js scripts.
For CommonJS you need Nano ID 3.x (we still support it):

```bash
npm install --save nanoid@3
```

For quick hacks, you can load Nano ID from CDN. Though, it is not recommended
to be used in production because of the lower loading performance.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


## API

Nano ID has 2 APIs: normal and non-secure.

By default, Nano ID uses URL-friendly symbols (`A-Za-z0-9_-`) and returns an ID
with 21 characters (to have a collision probability similar to UUID v4).


### Blocking

The safe and easiest way to use Nano ID.

In rare cases could block CPU from other work while noise collection
for hardware random generator.

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

If you want to reduce the ID size (and increase collisions probability),
you can pass the size as an argument.

```js
nanoid(10) //=> "IRFa-VaY2b"
```

Don’t forget to check the safety of your ID size
in our [ID collision probability] calculator.

You can also use a [custom alphabet](#custom-alphabet-or-size)
or a [random generator](#custom-random-bytes-generator).

[ID collision probability]: https://zelark.github.io/nano-id-cc/


### Non-Secure

By default, Nano ID uses hardware random bytes generation for security
and low collision probability. If you are not so concerned with security,
you can use it for environments without hardware random generators.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### Custom Alphabet or Size

`customAlphabet` returns a function that allows you to create `nanoid`
with your own alphabet and ID size.

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid() //=> "4f90d13a42"
```

```js
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdef', 10)
user.id = nanoid()
```

Check the safety of your custom alphabet and ID size in our
[ID collision probability] calculator. For more alphabets, check out the options
in [`nanoid-dictionary`].

Alphabet must contain 256 symbols or less.
Otherwise, the security of the internal generator algorithm is not guaranteed.

In addition to setting a default size, you can change the ID size when calling
the function:

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[ID collision probability]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-dictionary`]:      https://github.com/CyberAP/nanoid-dictionary


### Custom Random Bytes Generator

`customRandom` allows you to create a `nanoid` and replace alphabet
and the default random bytes generator.

In this example, a seed-based generator is used:

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

`random` callback must accept the array size and return an array
with random numbers.

If you want to use the same URL-friendly symbols with `customRandom`,
you can get the default alphabet using the `urlAlphabet`.

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

Note, that between Nano ID versions we may change random generator
call sequence. If you are using seed-based generators, we do not guarantee
the same result.


## Usage

### React

There’s no correct way to use Nano ID for React `key` prop
since it should be consistent among renders.

```jsx
function Todos({todos}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* DON’T DO IT */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

You should rather try to reach for stable ID inside your list item.

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

In case you don’t have stable IDs you'd rather use index as `key`
instead of `nanoid()`:

```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* Still not recommended but preferred over nanoid().
                      Only do this if items have no stable IDs. */
    {text}
  </li>
)
```

In case you just need random IDs to link elements like labels
and input fields together, [`useId`] is recommended.
That hook was added in React 18.

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native

React Native does not have built-in random generator. The following polyfill
works for plain React Native and Expo starting with `39.x`.

1. Check [`react-native-get-random-values`] docs and install it.
2. Import it before Nano ID.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### PouchDB and CouchDB

In PouchDB and CouchDB, IDs can’t start with an underscore `_`.
A prefix is required to prevent this issue, as Nano ID might use a `_`
at the start of the ID by default.

Override the default ID with the following option:

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### Web Workers

Web Workers do not have access to a secure random generator.

Security is important in IDs when IDs should be unpredictable.
For instance, in "access by URL" link generation.
If you do not need unpredictable IDs, but you need to use Web Workers,
you can use the non‑secure ID generator.

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

Note: non-secure IDs are more prone to collision attacks.


### CLI

You can get unique ID in terminal by calling `npx nanoid`. You need only
Node.js in the system. You do not need Nano ID to be installed anywhere.

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

Size of generated ID can be specified with `--size` (or `-s`) option:

```sh
$ npx nanoid --size 10
L3til0JS4z
```

Custom alphabet can be specified with `--alphabet` (or `-a`) option
(note that in this case `--size` is required):

```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```

### Other Programming Languages

Nano ID was ported to many languages. You can use these ports to have
the same ID generator on the client and server side.

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure and ClojureScript](https://github.com/zelark/nano-id)
* [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Deno](https://github.com/ianfabs/nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Haskell](https://github.com/MichelBoucey/NanoID)
* [Haxe](https://github.com/flashultra/uuid)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/aventrix/jnanoid)
* [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [OCaml](https://github.com/routineco/ocaml-nanoid)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid)
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
* Postgres [Extension](https://github.com/spa5k/uids-postgres)
  and [Native Function](https://github.com/viascom/nanoid-postgres)
* [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
* [V](https://github.com/invipal/nanoid)
* [Zig](https://github.com/SasLuca/zig-nanoid)

For other environments, [CLI] is available to generate IDs from a command line.

[CLI]: #cli


## Tools

* [ID size calculator] shows collision probability when adjusting
  the ID alphabet or size.
* [`nanoid-dictionary`] with popular alphabets to use with [`customAlphabet`].
* [`nanoid-good`] to be sure that your ID doesn’t contain any obscene words.

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size calculator]:  https://zelark.github.io/nano-id-cc/
[`customAlphabet`]:    #custom-alphabet-or-size
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
