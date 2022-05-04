# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | [Русский](./README.ru.md) | **简体中文** | [Bahasa Indonesia](./README.id-ID.md)

一个小巧、安全、URL友好、唯一的 JavaScript 字符串ID生成器。

> “一个惊人的无意义的完美主义水平,
> 这简直让人无法不敬佩。”

* **小巧.** 130 bytes (已压缩和 gzipped)。 没有依赖。
  [Size Limit] 控制大小。
* **快速.** 它比 UUID 快 60%。
* **安全.** 它使用加密的强随机 API。可在集群中使用。
* **紧凑.** 它使用比 UUID（`A-Za-z0-9_-`）更大的字母表。
  因此，ID 大小从36个符号减少到21个符号。
* **易用.** Nano ID 已被移植到
  [20种编程语言](#其他编程语言)。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

支持现代浏览器、IE [使用 Babel]、Node.js 和 React Native。

[在线工具]: https://gitpod.io/#https://github.com/ai/nanoid/
[使用 Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## 目录

* [与 UUID 的比较](#与-uuid-的比较)
* [基准值](#基准值)
* [安全性](#安全性)
* [API](#api)
  * [阻塞](#阻塞)
  * [异步](#异步)
  * [不安全](#不安全)
  * [自定义字母或大小](#自定义字母或大小)
  * [自定义随机字节生成器](#自定义随机字节生成器)
* [用法](#用法)
  * [IE](#ie)
  * [React](#react)
  * [React Native](#react-native)
  * [Rollup](#rollup)
  * [PouchDB and CouchDB](#pouchdb-and-couchdb)
  * [Mongoose](#mongoose)
  * [Web Workers](#web-workers)
  * [CLI](#cli)
  * [其他编程语言](#other-programming-languages)
* [工具](#工具)


## 与 UUID 的比较

Nano ID 与 UUID v4 (基于随机) 相当。
它们在 ID 中有相似数量的随机位
(Nano ID 为126，UUID 为122),因此它们的冲突概率相似：:

> 要想有十亿分之一的重复机会,
> 必须产生103万亿个版本4的ID.

Nano ID 和 UUID v4之间有三个主要区别:

1. Nano ID 使用更大的字母表，所以类似数量的随机位
   被包装在21个符号中，而不是36个。
2. Nano ID 代码比 `uuid/v4` 包少 **4倍**: 130字节而不是483字节.
3. 由于内存分配的技巧，Nano ID 比 UUID 快 **60%**。


## 基准值

```rust
$ node ./test/benchmark.js
crypto.randomUUID         25,603,857 ops/sec
@napi-rs/uuid              9,973,819 ops/sec
uid/secure                 8,234,798 ops/sec
@lukeed/uuid               7,464,706 ops/sec
nanoid                     5,616,592 ops/sec
customAlphabet             3,115,207 ops/sec
uuid v4                    1,535,753 ops/sec
secure-random-string         388,226 ops/sec
uid-safe.sync                363,489 ops/sec
cuid                         187,343 ops/sec
shortid                       45,758 ops/sec

Async:
nanoid/async                  96,094 ops/sec
async customAlphabet          97,184 ops/sec
async secure-random-string    92,794 ops/sec
uid-safe                      90,684 ops/sec

Non-secure:
uid                       67,376,692 ops/sec
nanoid/non-secure          2,849,639 ops/sec
rndm                       2,674,806 ops/sec
```

测试配置: ThinkPad X1 Carbon Gen 9, Fedora 34, Node.js 16.10.


## 安全性

*请看一篇关于随机生成器理论的好文章:
[安全的随机值 (在 Node.js 中)]*

* **不可预测性.** 不使用不安全的 `Math.random()`, Nano ID
  使用 Node.js 的 `crypto` 模块和浏览器的 Web Crypto API。
  这些模块使用不可预测的硬件随机生成器。
* **统一性.** `随机 % 字母表` 是编写ID生成器时常犯的一个错误。
  符号的分布是不均匀的; 有些符号出现的几率会比其他符号低。因此, 它将减少刷新时的尝试次数。
  Nano ID 使用了一种 [更好的算法]，并进行了一致性测试。

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

* **有据可查:** 所有的 Nano ID 的行为都有记录。
  见 [源代码] 中的注释。
* **漏洞:** 报告安全漏洞，请使用
  [安全联系人 Tidelift](https://tidelift.com/security).
  Tidelift 将协调修复和披露。

[安全的随机值 (在 Node.js 中)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[更好的算法]:                  https://github.com/ai/nanoid/blob/main/index.js
[源代码]:                     https://github.com/ai/nanoid/blob/main/index.js


## 安装

```bash
npm install --save nanoid
```

对于快速的骇客用法，你可以从 CDN 加载 Nano ID。但是，它不建议
在生产中使用，因为它的加载性能较低。

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```

Nano ID提供ES模块。在 webpack、Rollup、Parcel 或 Node.js 中
你不需要做任何事情来使用 Nano ID

```js
import { nanoid } from 'nanoid'
```

在 Node.js 中，你可以使用 CommonJS 导入:

```js
const { nanoid } = require('nanoid')
```


## API

Nano ID 有3个 API：正常(阻塞)，异步，和不安全。

默认情况下，Nano ID 使用 URL 友好的符号（`A-Za-z0-9_-`）并返回一个
有21个字符（类似UUID v4的冲突概率）的ID。


### 阻塞

使用 Nano ID 最安全、最简单的方法

在极少数情况下，噪声收集时可能会阻止CPU执行其他工作
用于硬件随机发生器。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

如果你想要减小ID size（但是会增加冲突概率），
可以将 size 作为参数传递

```js
nanoid(10) //=> "IRFa-VaY2b"
```

别忘了检查你的ID size 的安全性
在我们的 [ID 冲突概率] 计算器.

您也可以使用 [自定义字母表](#自定义字母或大小)
或者是 [自定义生成器](#自定义随机字节生成器).

[ID 冲突概率]: https://alex7kom.github.io/nano-nanoid-cc/


### 异步

为了生成硬件随机字节，CPU收集电磁噪声。
在大多数情况下，熵已经被收集。

在噪声收集期间的同步API中，CPU忙且
无法执行任何有用的操作（例如，处理另一个HTTP请求）。

使用Nano ID的异步API，可以在熵收集期间
运行另一个代码。

```js
import { nanoid } from 'nanoid/async'

async function createUser () {
  user.id = await nanoid()
}
```

阅读更多有关熵收集的信息 [`crypto.randomBytes`] 文档.

不幸的是，您将在浏览器中失去 Web Crypto API 的优势
如果您使用异步 API。那么，目前在浏览器中，
您将受到安全性或异步行为的限制。

[`crypto.randomBytes`]: https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback

### 不安全

默认情况下，Nano ID 使用硬件随机字节生成器来实现安全性
冲突概率低。如果你不那么关心安全
更关心性能的话，您可以使用更快的非安全生成器.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### 自定义字母或大小

`customAlphabet` 允许您使用自己的字母表创建 `nanoid`
和 ID size。

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid() //=> "4f90d13a42"
```

在我们的中 [ID 冲突概率] 计算器检查您的自定义字母表和 ID size 的安全性。
有关更多字母表, 请在 [`nanoid-dictionary`] 查看选项.

字母表必须包含256个或更少的符号。
否则，无法保证内部生成器算法的安全性。

还提供了可定制的异步和非安全API:

```js
import { customAlphabet } from 'nanoid/async'
const nanoid = customAlphabet('1234567890abcdef', 10)
async function createUser () {
  user.id = await nanoid()
}
```

```js
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdef', 10)
user.id = nanoid()
```

[`nanoid-dictionary`]:      https://github.com/CyberAP/nanoid-dictionary


### 自定义随机字节生成器

`customRandom` 允许您创建一个 `nanoid` 并替换字母表
和默认的随机字节生成器。

在此示例中，使用基于种子的生成器:

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

`random` 回调必须接受数组大小并返回随机数的数组。

如果要使用与 `customRandom` 相同的URL友好符号,
您可以使用 `urlAlphabet` 获取默认字母表。

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

异步和非安全 API 不适用于 `customRandom`。

## 用法


### IE

如果你需要支持 IE, 则需要使用 Babel [转换 `node_modules`]
并添加 `crypto` 别名:

```js
// polyfills.js
if (!window.crypto && window.msCrypto) {
  window.crypto = window.msCrypto

  const getRandomValuesDef = window.crypto.getRandomValues

  window.crypto.getRandomValues = function (array) {
    const values = getRandomValuesDef.call(window.crypto, array)
    const result = []

    for (let i = 0; i < array.length; i++) {
      result[i] = values[i];
    }

    return result
  };
}
```

```js
import './polyfills.js'
import { nanoid } from 'nanoid'
```

[转换 `node_modules`]: https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/


### React

目前还没有将 nanoid 用于 React `key` prop 的正确方法
因为它在不同的渲染中应该是一致的。

```jsx
function Todos({todos}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* 不要这样做 */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

您应该尝试在列表项中找到稳定的 id。

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

如果您没有稳定的 ID，您最好使用索引作为 `键` 而不是 `nanoid()`：

```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* 仍然不推荐，但优于 nanoid()。
                      仅当项目没有稳定ID时才执行此操作。 */
    {text}
  </li>
)
```

### React Native

React Native 没有内置的随机生成器。下面的 polyfill
适用于普通 React Native 和从 `39.x` 开始的 Expo。

1. 检查 [`react-native-get-random-values`] 文档并安装它。
2. 在 Nano ID 之前导入它。

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### Rollup

对于 Rollup 来说，你需要 [`@rollup/plugin-node-resolve`] 来绑定浏览器版本。

```js
  plugins: [
    nodeResolve({
      browser: true
    })
  ]
```

[`@rollup/plugin-node-resolve`]: https://github.com/rollup/plugins/tree/master/packages/node-resolve


### PouchDB and CouchDB

在 PouchDB 和 CouchDB 中，ID 不能以下划线 `_` 开头。
需要一个前缀来防止这个问题，因为 Nano ID 可能在默认情况下使用 `_` 作为 ID 的开头。
在默认情况下，在 ID 的开头使用 `_`。

用下面的选项覆盖默认的 ID。

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### Mongoose

```js
const mySchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid()
  }
})
```


### Web Workers

Web Workers 无法访问安全的随机生成器.

当ID应该是不可预测的时候，安全性对ID很重要。
例如，在 "按 URL 访问"的链接生成中。
如果你不需要不可预测的 ID，但你需要使用 Web Workers。
你可以使用非安全的 ID 生成器。

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### CLI

你可以通过调用 `npx nanoid` 在终端获得唯一的 ID。你只需要
在系统中安装了 Node.js。你不需要把 Nano ID 安装在任何地方。

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

如果你想改变字母或 ID size，你应该使用 [`nanoid-cli`]。

[`nanoid-cli`]: https://github.com/twhitbeck/nanoid-cli


### 其他编程语言

Nano ID 已被移植到许多语言。 你可以使用下面这些移植，获取在客户端和服务器端相同的ID生成器。

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure and ClojureScript](https://github.com/zelark/nano-id)
* [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Deno](https://github.com/ianfabs/nanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Haskell](https://github.com/MichelBoucey/NanoID)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/aventrix/jnanoid)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid)
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
* [Postgres Extension](https://github.com/spa5k/uids-postgres)
* [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
* [V](https://github.com/invipal/nanoid)
* [Zig](https://github.com/SasLuca/zig-nanoid)

此外，[CLI] 还可用于从命令行生成 ID。

[CLI]: #cli


## 工具

* [ID size 计算器] 显示调整时的冲突概率
  ID的字母或size。
* [`nanoid-dictionary`] 与常用的字母一起使用 [`自定义字母`]。
* [`nanoid-good`] 以确保你的ID不包含任何淫秽词汇。

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size 计算器]:  https://zelark.github.io/nano-id-cc/
[`自定义字母`]:    #自定义字母或大小
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
