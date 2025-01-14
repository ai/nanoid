# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | [Русский](./README.ru.md) | **简体中文** | [Bahasa Indonesia](./README.id-ID.md)

一个小巧、安全、URL友好、唯一的 JavaScript 字符串ID生成器。

> “一个惊人的无意义的完美主义水平，这简直让人无法不敬佩。”

* **小巧.** 118字节 (经过压缩和Brotli处理)。没有依赖。[Size Limit] 控制大小。
* **安全.** 它使用硬件随机生成器。可在集群中使用。
* **紧凑.** 它使用比 UUID（`A-Za-z0-9_-`）更大的字母表。因此，ID 大小从36个符号减少到21个符号。
* **可移植.** Nano ID 已被移植到 [20种编程语言](#其他编程语言)。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

支持现代浏览器、IE [需使用 Babel]、Node.js 和 React Native。

[在线工具]: https://gitpod.io/#https://github.com/ai/nanoid/
[使用 Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

## 目录

- [目录](#目录)
- [与 UUID 的比较](#与-uuid-的比较)
- [基准值](#基准值)
- [安全性](#安全性)
- [安装](#安装)
- [API](#api)
  - [阻塞](#阻塞)
  - [不安全](#不安全)
  - [自定义字母或大小](#自定义字母或大小)
  - [自定义随机字节生成器](#自定义随机字节生成器)
- [用法](#用法)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDB and CouchDB](#pouchdb-and-couchdb)
  - [Web Workers](#web-workers)
  - [CLI](#cli)
  - [其他编程语言](#其他编程语言)
- [工具](#工具)


## 与 UUID 的比较

Nano ID 与 UUID v4 (基于随机数) 相当。
它们在 ID 中有相似数量的随机位
(Nano ID 为126，UUID 为122),因此它们的碰撞概率相似：:

> 要想有十亿分之一的重复机会,
> 必须产生103万亿个版本4的ID.

Nano ID 和 UUID v4之间有两个主要区别:

1. Nano ID 使用更大的字母表，所以类似数量的随机位
   被包装在21个符号中，而不是36个。
2. Nano ID 代码比 `uuid/v4` 包少 **4倍**: 130字节而不是423字节.


## 基准值

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

测试配置: Framework 13 7840U, Fedora 39, Node.js 21.6.


## 安全性

*请看一篇关于随机生成器理论的好文章:
[安全的随机值 (在 Node.js 中)]*

* **不可预测性.** 不使用不安全的 `Math.random()`, Nano ID
  使用 Node.js 的 `crypto` 模块和浏览器的 Web Crypto API。
  这些模块使用不可预测的硬件随机生成器。
* **统一性.** `random % alphabet` 是编写ID生成器时常犯的一个错误。
  这样做会导致分布不均匀; 一些符号出现的机会较其他符号低。因此，在暴力破解时，尝试的次数会减少。
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
npm install nanoid
```

Nano ID 5 仅适用于 ESM 项目、测试或 Node.js 脚本。
对于 CommonJS，您需要 Nano ID 3.x（我们仍然支持它）：

```bash
npm install nanoid@3
```

想要快速上手尝试，你可以从 CDN 加载 Nano ID。但是，它不建议
在生产中使用，因为它的加载性能较低。

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


## API

Nano ID 有2个 API：正常(阻塞)，和不安全。

默认情况下，Nano ID 使用 URL 友好的符号（`A-Za-z0-9_-`）并返回一个
有21个字符（类似 UUID v4 的碰撞概率）的 ID。


### 阻塞

使用 Nano ID 最安全、最简单的方法

在极少数情况下，当收集硬件随机生成器的噪声时，可能会阻塞CPU，导致无法进行其他工作。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

如果你想要减小 ID 大小（但是会增加碰撞概率），
可以将大小作为参数传递

```js
nanoid(10) //=> "IRFa-VaY2b"
```

别忘了在我们的 [ID 碰撞概率] 计算器中检查你的 ID 大小的安全性。

您也可以使用 [自定义字母表](#自定义字母或大小)
或者是 [自定义生成器](#自定义随机字节生成器).

[ID 碰撞概率]: https://alex7kom.github.io/nano-nanoid-cc/


### 不安全

默认情况下，Nano ID 使用硬件随机字节生成以提供安全性和较低的碰撞概率。如果您对安全性不太担心，您可以在没有硬件随机生成器的环境中使用它

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### 自定义字母或大小

`customAlphabet` 返回一个函数，允许您使用自定义字母表和ID大小创建 `nanoid`。

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

在我们的 [ID 碰撞概率] 计算器中检查您的自定义字母表和 ID 大小的安全性。
查看 [`nanoid-dictionary`] 中的选项以获取更多字母表。

字母表必须包含256个或更少的符号。
否则，无法保证内部生成器算法的安全性。

除了设置默认大小外，您还可以在调用函数时更改ID大小：

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[ID collision probability]: https://alex7kom.github.io/nano-nanoid-cc/
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

请注意，在Nano ID的不同版本之间，我们可能会更改随机生成器的调用顺序。如果您正在使用基于种子的生成器，我们不能保证相同的结果。


## 用法

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

如果您只需要随机 ID 来将元素（如标签和输入字段）链接在一起，建议使用 [`useId`]。该钩子在 React 18 中添加。

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native

React Native 没有内置的随机生成器。以下polyfill适用于纯 React Native 和 Expo，从39.x版本开始生效。

1. 检查 [`react-native-get-random-values`] 文档并安装它。
2. 在 Nano ID 之前导入它。

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


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

注意：非安全的ID更容易受到碰撞攻击。


### CLI

你可以通过调用 `npx nanoid` 在终端获得唯一的 ID。你只需要
在系统中安装了 Node.js。你不需要把 Nano ID 安装在任何地方。

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

生成的ID的大小可以使用 `--size`（或 `-s` ）选项指定：

```sh
$ npx nanoid --size 10
L3til0JS4z
```

可以使用 `--alphabet`（或 `-a` ）选项指定自定义字母表（请注意，这种情况下需要 `--size` 选项）。

```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```


### 其他编程语言

Nano ID 已被移植到许多语言。 你可以使用下面这些移植，获取在客户端和服务器端相同的ID生成器。

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure and ClojureScript](https://github.com/zelark/nano-id)
* [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Deno](https://github.com/ianfabs/nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Gleam](https://github.com/0xca551e/glanoid)
* [Go](https://github.com/jaevor/go-nanoid)
* [Haskell](https://github.com/MichelBoucey/NanoID)
* [Haxe](https://github.com/flashultra/uuid)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/Soundicly/jnanoid-enhanced)
* [Kotlin](https://github.com/viascom/nanoid-kotlin)
* [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid)
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
* [Postgres Extension](https://github.com/spa5k/uids-postgres)
* [Postgres Native Function](https://github.com/viascom/nanoid-postgres)
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

* [ID size 计算器] 显示调整时的碰撞概率
  ID的字母或大小。
* [`nanoid-dictionary`] 与常用的字母一起使用 [`自定义字母`]。
* [`nanoid-good`] 以确保你的ID不包含任何淫秽词汇。

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size 计算器]:  https://zelark.github.io/nano-id-cc/
[`自定义字母`]:    #自定义字母或大小
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
