# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

**English** | [日本語](./README.ja.md) | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md) | [한국어](./README.ko.md)

**Quick Links:** [Quick Start](#quick-start) • [Installation](#installation) • [Usage](#usage) • [React](#react) • [API](#api) • [Troubleshooting](#troubleshooting) • [FAQ](#faq)

A tiny, secure, URL-friendly, unique string ID generator for JavaScript.

> “An amazing level of senseless perfectionism,
> which is simply impossible not to respect.”

- **Small.** 118 bytes (minified and brotlied). No dependencies.
  [Size Limit] controls the size.
- **Safe.** It uses hardware random generator. Can be used in clusters.
- **Short IDs.** It uses a larger alphabet than UUID (`A-Za-z0-9_-`).
  So ID size was reduced from 36 to 21 symbols.
- **Portable.** Nano ID was ported
  to over [20 programming languages](./README.md#other-programming-languages).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

## Quick Start

### Installation

```bash
npm install nanoid
```

### Usage

```js
import { nanoid } from 'nanoid'

const id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

For more examples, see [Installation](#installation) and [API](#api) sections.

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[with Babel]: https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]: https://github.com/ai/size-limit

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Comparison with UUID](#comparison-with-uuid)
- [Benchmark](#benchmark)
- [Security](#security)
- [Install](#install)
  - [ESM](#esm)
  - [CommonJS](#commonjs)
  - [JSR](#jsr)
  - [CDN](#cdn)
- [API](#api)
  - [Blocking](#blocking)
  - [Non-Secure](#non-secure)
  - [Custom Alphabet or Size](#custom-alphabet-or-size)
  - [Custom Random Bytes Generator](#custom-random-bytes-generator)
- [Usage](#usage)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDB and CouchDB](#pouchdb-and-couchdb)
  - [CLI](#cli)
  - [TypeScript](#typescript)
  - [Other Programming Languages](#other-programming-languages)
- [Tools](#tools)

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

### When to Use UUID Instead

While Nano ID is smaller and faster, UUID v4 (and newer versions) are appropriate when:

- Your database/ORM has **built-in UUID support** without extra libraries
- You need **offline UUID generation** with mathematically zero collision risk (UUID v6+ with timestamps)
- Your organization requires **standardized ID formats** for compliance or audit purposes
- You're already using a UUID library in your tech stack
- Your team is more familiar with UUID conventions

**Example: PostgreSQL with native UUID support**

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

PostgreSQL's native UUID type and functions mean you don't need JavaScript generation.

**Conclusion:** For most JavaScript projects, Nano ID's **smaller size** (21 vs 36 characters) and **faster generation** make it the better choice. UUID is appropriate if you have specific infrastructure or compliance requirements.

## Benchmark

```rust
$ node ./test/benchmark.js
crypto.randomUUID          7,619,041 ops/sec
uuid v4                    7,436,626 ops/sec
@napi-rs/uuid              4,730,614 ops/sec
uid/secure                 4,729,185 ops/sec
@lukeed/uuid               4,015,673 ops/sec
nanoid                     3,693,964 ops/sec
customAlphabet             2,799,255 ops/sec
nanoid for browser           380,915 ops/sec
secure-random-string         362,316 ops/sec
uid-safe.sync                354,234 ops/sec
shortid                       38,808 ops/sec

Non-secure:
uid                       11,872,105 ops/sec
nanoid/non-secure          2,226,483 ops/sec
rndm                       2,308,044 ops/sec
```

Test configuration: Framework 13 7840U, Fedora 39, Node.js 21.6.

## Security

_See a good article about random generators theory:
[Secure random values (in Node.js)]_

- **Unpredictability.** Instead of using the unsafe `Math.random()`, Nano ID
  uses the `crypto` module in Node.js and the Web Crypto API in browsers.
  These modules use unpredictable hardware random generator.
- **Uniformity.** `random % alphabet` is a popular mistake to make when coding
  an ID generator. The distribution will not be even; there will be a lower
  chance for some symbols to appear compared to others. So, it will reduce
  the number of tries when brute-forcing. Nano ID uses a [better algorithm]
  and is tested for uniformity.

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

- **Well-documented:** all Nano ID hacks are documented. See comments
  in [the source].
- **Vulnerabilities:** to report a security vulnerability, please use
  the [Tidelift security contact](https://tidelift.com/security).
  Tidelift will coordinate the fix and disclosure.

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[better algorithm]: https://github.com/ai/nanoid/blob/main/index.js
[the source]: https://github.com/ai/nanoid/blob/main/index.js

## Install

### ESM

Nano ID 5 works with ESM projects (with `import`) in tests or Node.js scripts.

```bash
npm install nanoid
```

**Node.js Compatibility:** Nano ID 5 requires **Node.js 18.0.0 or later** for native ESM support.

For browser environments, use the browser-specific entry point:

```js
import { nanoid } from 'nanoid/browser'
```

This uses the Web Crypto API instead of Node.js's `crypto` module, preventing "Cannot find module 'crypto'" errors.

### CommonJS

Nano ID can be used with CommonJS in one of the following ways:

- You can use `require()` to import Nano ID. You need to use latest Node.js
  22.12 (works out-of-the-box) or Node.js 20
  (with `--experimental-require-module`).

- For Node.js 18 you can dynamically import Nano ID as follows:

  ```js
  let nanoid
  module.exports.createID = async () => {
    if (!nanoid) ({ nanoid } = await import('nanoid'))
    return nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
  }
  ```

- You can use Nano ID 3.x (we still support it):

  ```bash
  npm install nanoid@3
  ```

### JSR

[JSR](https://jsr.io) is a replacement for npm with open governance
and active development (in contrast to npm).

```bash
npx jsr add @sitnik/nanoid
```

You can use it in Node.js, Deno, Bun, etc.

```js
// Replace `nanoid` to `@sitnik/nanoid` in all imports
import { nanoid } from '@sitnik/nanoid'
```

For Deno install it by `deno add jsr:@sitnik/nanoid` or import
from `jsr:@sitnik/nanoid`.

### CDN

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

### When to Use Non-Secure Mode

The `non-secure` API uses `Math.random()` instead of cryptographic random. It's approximately 2x faster but **predictable and not suitable for security-sensitive applications**.

**✅ SAFE to use non-secure for:**

- Animations and visual effects
- Game IDs and temporary game state
- UI component keys (when ID doesn't need to survive page reload)
- Internal analytics and tracking
- Form field temporary placeholders
- Non-persistent cache keys

**❌ NEVER use non-secure for:**

- Database primary keys
- API keys or authentication tokens
- User session IDs
- URLs that need to be hard to guess
- Anything exposed to untrusted users
- Security tokens or verification codes
- Anything used in production databases

**Example - Correct usage in animations:**

```js
import { nanoid } from 'nanoid/non-secure'

// Fast, but predictable - safe for animations
const animationId = nanoid()

// If the ID must be secure, use the standard version instead
import { nanoid as secureNanoid } from 'nanoid'
const secureId = secureNanoid() // Use this for databases, auth, etc.
```

**Rule of thumb:** If the ID will exist beyond the current browser session or be stored in a database, use the standard `nanoid()`. If it's temporary UI state, non-secure is fine.

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
[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary

### Choosing a Safe ID Size

By default, Nano ID generates 21-character IDs, which provide excellent collision safety. If you need a different size, use the [Nano ID collision calculator](https://zelark.github.io/nano-id-cc/) to verify your choice is safe.

**General guidelines for different use cases:**

| ID Length | Use Case                  | Collision Safety | Example      |
| --------- | ------------------------- | ---------------- | ------------ |
| 6         | Temporary, short URLs     | Low              | `nanoid(6)`  |
| 10        | Cache keys, sessions      | Medium           | `nanoid(10)` |
| 12        | API keys, invites         | High             | `nanoid(12)` |
| 21        | **Default**, primary keys | Very High        | `nanoid()`   |

**Examples:**

```js
// 21 characters (default, safest choice)
nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"

// 10 characters (suitable for cache keys, session IDs)
nanoid(10) //=> "IRFa-VaY2b"

// 6 characters (temporary IDs only)
nanoid(6) //=> "V1StGX"

// Custom alphabet + custom size
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789', 12)
nanoid() //=> "123456789012"
```

**Important Security Note:** Always verify your choice using the [collision probability calculator](https://zelark.github.io/nano-id-cc/), especially for security-critical applications like API keys or authentication tokens.

### Custom Random Bytes Generator

`customRandom` allows you to create a `nanoid` and replace alphabet
and the default random bytes generator.

In this example, a seed-based generator is used:

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return new Uint8Array(size).map(() => 256 * rng())
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

## Troubleshooting

### "Cannot find module 'crypto'" or "Error resolving 'crypto'"

**Problem:** You see an error like:

```
Cannot find module 'crypto'
Error resolving 'crypto'
```

**Cause:** You're using the Node.js version in a browser or browser bundler.

**Solution:** Use the browser-specific entry point:

```js
// ❌ Wrong - Uses Node.js crypto module
import { nanoid } from 'nanoid'

// ✅ Correct - Uses Web Crypto API
import { nanoid } from 'nanoid/browser'
```

### "node:crypto is not defined" in Next.js

**Problem:** Error appears when using Nano ID in Next.js App Router.

**Cause:** Next.js App Router code runs in the browser by default, but you imported the Node.js version.

**Solution:** Mark server-only code with `'use server'`:

```js
'use server'

import { nanoid } from 'nanoid'

export async function generateId() {
  return nanoid()
}
```

Or use the browser entry point in client code:

```js
'use client'

import { nanoid } from 'nanoid/browser'

export default function ClientComponent() {
  const id = nanoid()
  return <div id={id}>...</div>
}
```

### ESM Import Issues in CommonJS Projects

**Problem:** Cannot use `import { nanoid } from 'nanoid'` in a CommonJS project.

**Cause:** Nano ID 5 is ESM-only. CommonJS requires a different approach.

**Solution Option 1 - Use CommonJS entry point:**

```js
const { nanoid } = require('nanoid')
const id = nanoid()
```

**Solution Option 2 - Use dynamic import (Node.js 13.2+):**

```js
const { nanoid } = await import('nanoid')
const id = nanoid()
```

See the [CommonJS](#commonjs) section for more details.

## Usage

### React

Generate IDs during component initialization, **not** during render:

```js
import { useState } from 'react'
import { nanoid } from 'nanoid'

// ✅ Correct: ID is created once and stays stable
export default function MyComponent() {
  const [id] = useState(() => nanoid())

  return <div id={id}>Component with unique ID</div>
}
```

**Do NOT generate IDs during render:**

```js
// ❌ Wrong: Creates new ID on every render, breaks React
export default function MyComponent() {
  const id = nanoid() // This changes every render!
  return <div id={id}>Component with unique ID</div>
}
```

**For lists of items, generate IDs when creating items:**

```js
export default function List() {
  const [items, setItems] = useState([])

  const addItem = () => {
    // ✅ Correct: ID created once with the item
    setItems([...items, { id: nanoid(), text: '' }])
  }

  return (
    <>
      <button onClick={addItem}>Add Item</button>
      {items.map(item => (
        <input key={item.id} defaultValue={item.text} />
      ))}
    </>
  )
}
```

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

### TypeScript

Nano ID allows casting generated strings into opaque strings in TypeScript.
For example:

```ts
declare const userIdBrand: unique symbol
type UserId = string & { [userIdBrand]: true }

// Use explicit type parameter:
mockUser(nanoid<UserId>())

interface User {
  id: UserId
  name: string
}

const user: User = {
  // Automatically casts to UserId:
  id: nanoid(),
  name: 'Alice'
}
```

### Other Programming Languages

Nano ID was ported to many languages. You can use these ports to have
the same ID generator on the client and server side.

- [C](https://github.com/lukateras/nanoid.h)
- [C#](https://github.com/codeyu/nanoid-net)
- [C++](https://github.com/mcmikecreations/nanoid_cpp)
- [Clojure and ClojureScript](https://github.com/zelark/nano-id)
- [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
- [Crystal](https://github.com/mamantoha/nanoid.cr)
- [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
- [Elixir](https://github.com/railsmechanic/nanoid)
- [Gleam](https://github.com/0xca551e/glanoid)
- [Go](https://github.com/matoous/go-nanoid)
- [Haskell](https://github.com/MichelBoucey/NanoID)
- [Haxe](https://github.com/flashultra/uuid)
- [Janet](https://sr.ht/~statianzo/janet-nanoid/)
- [Java](https://github.com/wosherco/jnanoid-enhanced)
- [Kotlin](https://github.com/viascom/nanoid-kotlin)
- [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
- [Nim](https://github.com/icyphox/nanoid.nim)
- [OCaml](https://github.com/routineco/ocaml-nanoid)
- [Perl](https://github.com/tkzwtks/Nanoid-perl)
- [PHP](https://github.com/hidehalo/nanoid-php)
- Python [native](https://github.com/puyuan/py-nanoid) implementation
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
  and [fast](https://github.com/oliverlambson/fastnanoid) implementation (written in Rust)
- Postgres [Extension](https://github.com/spa5k/uids-postgres)
  and [Native Function](https://github.com/viascom/nanoid-postgres)
- [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
- [Ruby](https://github.com/radeno/nanoid.rb)
- [Rust](https://github.com/nikolay-govorov/nanoid)
- [Swift](https://github.com/ShivaHuang/swift-nanoid)
- [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
- [V](https://github.com/invipal/nanoid)
- [Zig](https://github.com/SasLuca/zig-nanoid)

For other environments, [CLI] is available to generate IDs from a command line.

[CLI]: #cli

## Tools

- [ID size calculator] shows collision probability when adjusting
  the ID alphabet or size.
- [`nanoid-dictionary`] with popular alphabets to use with [`customAlphabet`].
- [`nanoid-good`] to be sure that your ID doesn’t contain any obscene words.

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size calculator]: https://zelark.github.io/nano-id-cc/
[`customAlphabet`]: #custom-alphabet-or-size
[`nanoid-good`]: https://github.com/y-gagar1n/nanoid-good
