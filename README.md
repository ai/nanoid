# Nano ID for Deno

[![JSR](https://jsr.io/badges/@qz/nanoid-deno)](https://jsr.io/@qz/nanoid-deno)
[![JSR Score](https://jsr.io/badges/@qz/nanoid-deno/score)](https://jsr.io/@qz/nanoid-deno)

<img src="https://ai.github.io/nanoid/logo.svg" align="right" alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

_Inspired by the following parent project:
[ai's nanoid](https://github.com/ai/nanoid)_

A tiny, secure, URL-friendly, unique string ID generator for Deno.

> “An amazing level of senseless perfectionism, which is simply impossible not
> to respect.”

- **Safe.** It uses hardware random generator. Can be used in clusters.
- **Short IDs.** It uses a larger alphabet than UUID (`A-Za-z0-9_-`). So ID size
  was reduced from 36 to 21 symbols.
- **Portable.** Nano ID was ported to over
  [20 programming languages](#other-programming-languages).

## Quickstart

The safe and easiest way to use Nano ID.

Add the module:

```bash
deno add @qz/nanoid-deno
```

Then, you can use the module in your code like this:

```ts
import { nanoid } from "@qz/nanoid-deno";

const id = nanoid(); //=> "Uakgb_J5m9g-0JDMbcJqL"
```

In rare cases, it could block the CPU from other tasks while it's collecting
noise for the hardware random generator.

## Table of Contents

- [Comparison with UUID](#comparison-with-uuid)
- [Security](#security)
- [API](#api)
  - [ID Size](#id-size)
  - [Non-Secure](#non-secure)
  - [Custom Alphabet or Size](#custom-alphabet-or-size)
  - [Custom Random Bytes Generator](#custom-random-bytes-generator)
- [Usage]()
- [Tools](#tools)

## Comparison with UUID

Nano ID is quite comparable to UUID v4 (random-based). It has a similar number
of random bits in the ID (126 in Nano ID and 122 in UUID), so it has a
similar collision probability:

> For there to be a one in a billion chance of duplication, 103 trillion version
> 4 IDs must be generated.

Nano ID uses a bigger alphabet, so it packs in a similar number of random bits
in just 21 symbols instead of 36.

## Security

_See a good article about random generators theory:
[Secure random values (in Node.js)](https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba)_

- **Unpredictability.** Instead of using the unsafe `Math.random()`, Nano ID
  uses the `crypto` module in Deno. These modules use unpredictable hardware
  random generator.
- **Uniformity.** `random % alphabet` is a popular mistake to make when coding
  an ID generator. The distribution will not be even; there will be a lower
  chance for some symbols to appear compared to others. So, it will reduce the
  number of tries when brute-forcing. Nano ID uses a
  [better algorithm](./src/nanoid.ts) and is tested for uniformity.

  <img src="https://raw.githubusercontent.com/quadratz/nanoid-deno/main/img/distribution.png" alt="Nano ID uniformity"
 width="340" height="135">

- **Well-documented:** All Nano ID hacks are documented. See comments in
  [the source code](./src/nanoid.ts).
- **Vulnerabilities:** to report a security vulnerability, please use the
  [Tidelift security contact](https://tidelift.com/security).
  Tidelift will coordinate the fix and disclosure.

## API

Nano ID has 2 APIs: normal and non-secure.

By default, Nano ID uses URL-friendly symbols (`A-Za-z0-9_-`) and returns an ID
with 21 characters. (to have a collision probability similar to UUID v4).

### ID Size

If you want to reduce the ID size (and increase collisions probability), you can
pass the size as an argument.

```ts
nanoid(10); //=> "IRFa-VaY2b"
```

Don’t forget to check the safety of your ID size in our
[ID collision probability](https://zelark.github.io/nano-id-cc/) calculator.

You can also use a [custom alphabet](#custom-alphabet-or-size) or a
[random generator](#custom-random-bytes-generator).

### Non-Secure

By default, Nano ID uses hardware random bytes generation for security and low
collision probability. If you are not so concerned with security, you can use it
for environments without hardware random generators.

```ts
import { nanoid } from "@qz/nanoid-deno/non_secure";
const id = nanoid(); //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

### Custom Alphabet or Size

`customAlphabet` returns a function that allows you to create `nanoid` with your
own alphabet and ID size.

```ts
import { customAlphabet } from "@qz/nanoid-deno";
const nanoid = customAlphabet("1234567890abcdef", 10);
const id = nanoid(); //=> "4f90d13a42"
```

Check the safety of your custom alphabet and ID size in our
[ID collision probability](https://alex7kom.github.io/nano-nanoid-cc/)
calculator. For more alphabets, check out the options
in [`nanoid-dictionary`](https://github.com/CyberAP/nanoid-dictionary).

Alphabet must contain 256 symbols or less. Otherwise, the security of the
internal generator algorithm is not guaranteed.

In addition to setting a default size, you can change the ID size when calling
the function:

```ts
import { customAlphabet } from "@qz/nanoid-deno";
const nanoid = customAlphabet("1234567890abcdef", 10);
const id = nanoid(5); //=> "f01a2"
```

### Custom Random Bytes Generator

`customRandom` allows you to create a `nanoid` and replace alphabet and the
default random bytes generator.

In this example, a seed-based generator is used:

```ts
import { customRandom } from "@qz/nanoid-deno";

const rng = seedrandom(seed);
const nanoid = customRandom("abcdef", 10, (size) => {
  return (new Uint8Array(size)).map(() => 256 * rng());
});

const id = nanoid(); //=> "fbaefaadeb"
```

`random` callback must accept the array size and return an array with random
numbers.

If you want to use the same URL-friendly symbols with `customRandom`, you can
get the default alphabet using the `urlAlphabet`.

```ts
import { customRandom, urlAlphabet } from "@qz/nanoid-deno";

const nanoid = customRandom(urlAlphabet, 10, myRandomGenerator);
```

Note, that between Nano ID versions we may change random generator call
sequence. If you are using seed-based generators, we do not guarantee the same
result.

## Usage

### CLI

To generate a unique ID in the terminal, you can simply run this command:

```ansi
$ deno run @qz/nanoid-deno/cli
LZfXLFzPPR4NNrgjlWDxn
```

For easier access, you can install nanoid-deno globally on your machine with
this command:

```ansi
$ deno install --global -n nanoid jsr@qz/nanoid-deno/cli
✅ Successfully installed nanoid
/home/qz/.deno/bin/nanoid
```

Once installed, you can generate IDs by just typing `nanoid`:

```ansi
$ nanoid
LZfXLFzPPR4NNrgjlWDxn
```

If you ever need to remove the package, you can do so with this command:

```ansi
$ deno uninstall --global nanoid
deleted /home/qz/.deno/bin/nanoid
✅ Successfully uninstalled nanoid
```

You can also customize the the length of the generated ID using the `--size` (or
`-s`) option:

```ansi
$ nanoid --size 10
L3til0JS4z
```

To create IDs with a specific set of characters, use the `--alphabet` (or `-a`)
option along with `--size`:

```ansi
$ nanoid --alphabet abc --size 15
bccbcabaabaccab
```

### Other Programming Languages

Nano ID was ported to many languages. You can use these ports to have the same
ID generator on the client and server side.

- [C#](https://github.com/codeyu/nanoid-net)
- [C++](https://github.com/mcmikecreations/nanoid_cpp)
- [Clojure and ClojureScript](https://github.com/zelark/nano-id)
- [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
- [Crystal](https://github.com/mamantoha/nanoid.cr)
- [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
- Deno:
  - [nanoid-deno](https://github.com/quadratz/nanoid-deno) (this project)
  - [nanoid](https://github.com/ianfabs/nanoid)
- [Elixir](https://github.com/railsmechanic/nanoid)
- [Go](https://github.com/matoous/go-nanoid)
- [Haskell](https://github.com/MichelBoucey/NanoID)
- [Haxe](https://github.com/flashultra/uuid)
- [Janet](https://sr.ht/~statianzo/janet-nanoid/)
- [Java](https://github.com/Soundicly/jnanoid-enhanced)
- [Kotlin](https://github.com/viascom/nanoid-kotlin)
- [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
- [Nim](https://github.com/icyphox/nanoid.nim)
- [OCaml](https://github.com/routineco/ocaml-nanoid)
- [Perl](https://github.com/tkzwtks/Nanoid-perl)
- [PHP](https://github.com/hidehalo/nanoid-php)
- Python [native](https://github.com/puyuan/py-nanoid) implementation with
  [dictionaries](https://pypi.org/project/nanoid-dictionary) and
  [fast](https://github.com/oliverlambson/fastnanoid) implementation (written in
  Rust)
- Postgres [Extension](https://github.com/spa5k/uids-postgres) and
  [Native Function](https://github.com/viascom/nanoid-postgres)
- [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
- [Ruby](https://github.com/radeno/nanoid.rb)
- [Rust](https://github.com/nikolay-govorov/nanoid)
- [Swift](https://github.com/antiflasher/NanoID)
- [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
- [V](https://github.com/invipal/nanoid)
- [Zig](https://github.com/SasLuca/zig-nanoid)

## Tools

- [ID size calculator](https://zelark.github.io/nano-id-cc/) shows collision
  probability when adjusting the ID alphabet or size.
- [`nanoid-dictionary`](https://github.com/CyberAP/nanoid-dictionary) with
  popular alphabets to use with [`customAlphabet`](#custom-alphabet-or-size).
- [`nanoid-good`](https://github.com/y-gagar1n/nanoid-good) to be sure that your
  ID doesn’t contain any obscene words.
