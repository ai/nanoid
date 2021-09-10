# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | 简体中文

一个小巧、安全、URL友好、唯一的 JavaScript 字符串ID生成器。

> “一个惊人的无意义的完美主义水平,
> 这简直让人无法不敬佩。”

* **小巧.** 108 bytes (已压缩和 gzipped)。 没有依赖。
  [Size Limit] 控制大小。
* **快速.** 它比 UUID 快 60%。
* **安全.** 它使用加密的强随机 API。
  可在集群中使用。
* **紧凑.** 它使用比 UUID（`A-Za-z0-9_-`）更大的字母表。
  因此，ID 大小从36个符号减少到21个符号。
* **易用.** Nano ID 已被移植到[14种编程语言](#other-programming-languages)。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

支持现代浏览器、IE[使用 Babel]、Node.js 和 React Native。

[在线工具]: https://gitpod.io/#https://github.com/ai/nanoid/
[使用 Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[大小限制]:  https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## 目录

* [与 UUID 的比较](#comparison-with-uuid)
* [基准值](#benchmark)
* [工具](#tools)
* [安全性](#security)
* [用法](#usage)
  * [JS](#js)
  * [IE](#ie)
  * [React](#react)
  * [Create React App](#create-react-app)
  * [React Native](#react-native)
  * [Rollup](#rollup)
  * [PouchDB and CouchDB](#pouchdb-and-couchdb)
  * [Mongoose](#mongoose)
  * [ES Modules](#es-modules)
  * [Web Workers](#web-workers)
  * [CLI](#cli)
  * [其他编程语言](#other-programming-languages)
* [API](#api)
  * [Async](#async)
  * [Non-Secure](#non-secure)
  * [customAlphabet or Size](#custom-alphabet-or-size)
  * [Custom Random Bytes Generator](#custom-random-bytes-generator)


## 与 UUID 的比较

Nano ID 与 UUID v4 (基于随机) 相当。
它们在 ID 中有相似数量的随机位
(Nano ID 为126，UUID 为122),因此它们的冲突概率相似：:

> 要想有十亿分之一的重复机会,
> 必须产生103万亿个版本4的ID.

Nano ID 和 UUID v4之间有三个主要区别:

1. Nano ID 使用更大的字母表，所以类似数量的随机位
   被包装在21个符号中，而不是36个。
2. Nano ID 代码比 `uuid/v4` 包少 **4.5倍**:
   108字节而不是483字节.
3. 由于内存分配的技巧，Nano ID 比 UUID 快 **60%**。


## 基准值

```rust
$ node ./test/benchmark.js
nanoid                    2,280,683 ops/sec
customAlphabet            1,851,117 ops/sec
uuid v4                   1,348,425 ops/sec
uid.sync                    313,306 ops/sec
secure-random-string        294,161 ops/sec
cuid                        158,988 ops/sec
shortid                      37,222 ops/sec

Async:
async nanoid                 95,500 ops/sec
async customAlphabet         93,800 ops/sec
async secure-random-string   90,316 ops/sec
uid                          85,583 ops/sec

Non-secure:
non-secure nanoid         2,641,654 ops/sec
rndm                      2,447,086 ops/sec
```

测试配置: Dell XPS 2-in-1 7390, Fedora 32, Node.js 15.1.


## 工具

* [ID size 计算器] 显示调整时的冲突概率
  ID的字母或size。
* [`nanoid-dictionary`] 与常用的字母一起使用 "自定义字母"。
* [`nanoid-good`] 以确保你的ID不包含任何淫秽词汇。

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size calculator]:  https://zelark.github.io/nano-id-cc/
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good


## 安全性

*请看一篇关于随机生成器理论的好文章:
[]*安全的随机值 (在 Node.js 中)

* **不可预测性.** 不使用不安全的 `Math.random()`, Nano ID
  使用 Node.js 的 `crypto` 模块和浏览器的 Web Crypto API。
  这些模块使用不可预测的硬件随机生成器。
* **统一性.** `随机 % 字母表` 是编写ID生成器时常犯的一个错误。
  符号的分布是不均匀的; 有些符号出现的几率会比其他符号低。因此, 它将减少刷新时的尝试次数。
  Nano ID使用了一种[更好的算法]，并进行了一致性测试。

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

* **漏洞:** 报告安全漏洞，请使用
  [安全联系人 Tidelift](https://tidelift.com/security).
  Tidelift将协调修复和披露。

[安全的随机值 (在 Node.js 中)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[更好的算法]:                  https://github.com/ai/nanoid/blob/main/index.js


## 用法

### JS

主模块使用 URL 友好的符号（`A-Za-z0-9\-`）并返回一个具有21个字符的 ID
（具有类似于 UUID v4的冲突概率）。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

在 node.js 中你可以使用 CommonJS 导入:

```js
const { nanoid } = require('nanoid')
```

如果要减小 ID 的size（但是会增加冲突概率），
可以将size作为参数传递。

```js
nanoid(10) //=> "IRFa-VaY2b"
```

不要忘记在我们的[ID 冲突概率]计算器中检查你的 ID size的安全性

你也可以使用一个[自定义字母](#custom-alphabet-or-size)。
或一个[随机发生器](#custom-random-bytes-generator)。

[ID collision probability]: https://zelark.github.io/nano-id-cc/


### IE

如果你需要支持 IE, 则需要使用 Babel [转换 `node_modules`]
并添加 `crypto` 别名:

```js
// polyfills.js
if (!window.crypto) {
  window.crypto = window.msCrypto
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

您应该尝试在列表项中找到稳定的id。

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
  <li key={index}> /* 仍然不推荐，但优于nanoid()。
                      仅当项目没有稳定ID时才执行此操作。 */
    {text}
  </li>
)
```

如果要在 `ID` 属性中使用 Nano ID，必须设置一些字符串前缀
（HTML ID以数字开头是无效的）。

```jsx
<input id={'id' + this.id} type="text"/>
```


### Create React App

Create React App 的版本 < 4.0.0 有
[一个问题](https://github.com/ai/nanoid/issues/205) 使用ES模块包.

```
TypeError: (0 , _nanoid.nanoid) is not a function
```

如果您使用版本小于 CRA 4.0，请使用 Nano ID 2 `npm i nanoid@^2.0.0`。


### React Native

React Native 没有内置的随机生成器。下面的 polyfill
适用于普通 React Native 和从 `39.x` 开始的 Expo。

1. 检查[`react-native-get-random-values`] 文档并安装它。
2. 在 Nano ID 之前导入它。

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

对于 Expo framework 见下一章节.

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### Rollup

对于 Rollup 来说，你需要[`@rollup/plugin-node-resolve`]来绑定浏览器版本。
除了这个库，还需要[@rollup/plugin-replace`]来替换 `process.env.NODE_ENV`。

```js
  plugins: [
    nodeResolve({
      browser: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
```

[`@rollup/plugin-node-resolve`]: https://github.com/rollup/plugins/tree/master/packages/node-resolve
[`@rollup/plugin-replace`]: https://github.com/rollup/plugins/tree/master/packages/replace


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


### ES Modules

Nano ID提供ES模块。在 webpack、Rollup、Parcel 或 Node.js 中你不需要做任何事情来使用 Nano ID

```js
import { nanoid } from 'nanoid'
```

对于快速的骇客用法，你可以从 CDN 加载 Nano ID。特殊的小型化
`nanoid.js` 模块可以在 jsDelivr 上找到.

不过, 不建议在生产中使用它，因为它的加载性能较低.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


### Web Workers

Web Workers 无法访问安全的随机生成器.

当ID应该是不可预测的时候，安全性对ID很重要。
例如，在 "按 URL 访问"的链接生成中。
如果你不需要不可预测的ID，但你需要使用Web Workers。
你可以使用非安全的ID生成器。

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

注意：非安全的ID更容易遇到冲突


### CLI

你可以通过调用 `npx nanoid` 在终端获得唯一的ID。你只需要
在系统中安装了 Node.js。你不需要把Nano ID安装在任何地方。

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

如果你想改变字母或IDsize，你应该使用[`nanoid-cli`]。

[`nanoid-cli`]: https://github.com/twhitbeck/nanoid-cli


### 其他编程语言

Nano ID 已被移植到许多语言. 你可以使用下面这些移植在客户端和服务器端有相同的ID生成器.

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure and ClojureScript](https://github.com/zelark/nano-id)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Deno](https://github.com/ianfabs/nanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Haskell](https://github.com/4e6/nanoid-hs)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/aventrix/jnanoid)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid)
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [V](https://github.com/invipal/nanoid)

此外，[CLI]还可用于从命令行生成ID。

[CLI]: #cli


## API

### Async

为了生成硬件随机字节，CPU收集电磁噪声。
在噪声收集期间的同步API中，CPU忙且不能做任何有用的并行工作。
不能做任何有用的并行工作。

使用Nano ID的异步API，可以在运行过程中运行另一个代码熵集合


```js
import { nanoid } from 'nanoid/async'

async function createUser () {
  user.id = await nanoid()
}
```

不幸的是，您将在浏览器中失去 Web Crypto API 的优势
如果您使用异步 API。那么，目前在浏览器中，您将受到安全性或异步行为的限制。


### 不安全

默认情况下，Nano ID 使用硬件随机字节生成器来实现安全性
冲突概率低。如果你不那么关心安全
更关心性能的话，您可以使用更快的非安全生成器.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

注意：您的ID将更可预测，更容易遇到冲突。


### Custom Alphabet or Size

`customAlphabet` 允许您使用自己的字母表创建 `nanoid`
和 ID size。

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid() //=> "4f90d13a42"
```

在我们的中[ID 冲突概率]计算器检查您的自定义字母表和 ID size的安全性。
有关更多字母表, 请在[`nanoid-dictionary`]查看选项.

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

[ID 冲突概率]: https://alex7kom.github.io/nano-nanoid-cc/
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

`random` 回调必须接受数组大小并返回随机数数组。

如果要使用与 `customRandom` 相同的URL友好符号,
您可以使用 `urlAlphabet` 获取默认字母表。

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

异步和非安全 API 不适用于 `customRandom`。
