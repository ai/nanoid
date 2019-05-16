# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

一个用于 JavaScript 的唯一字符串 ID 生成器，它迷你、安全，并且对 URL 友好。

* **体积小：** 压缩并打包后仅占 141 字节，无依赖，它使用 [Size Limit] 来控制体积。
* **安全：** 它使用了一系列密码学上的非常健壮的 API，并且测试了各种符号的分布。
* **速度快：** 比 UUID 快16%。
* **紧凑的：** 它使用了一个比 UUID 更大的字符表 (`A-Za-z0-9_-`)。因此，他可以将 ID 长度从 36 缩减至 21。

```js
var nanoid = require('nanoid')
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

这个生成器支持 Node.js， React Native， 以及 [所有浏览器]。

[所有浏览器]: http://caniuse.com/#feat=getrandomvalues
[Size Limit]:   https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="由 Evil Martians 赞助支持" width="236" height="54">
</a>


## 与 UUID 比较

Nano ID 与 UUID v4 (random-based) 非常有可比性。 它与 UUID 有类似长度的随机位数（Nano ID: 126, UUID: 122），所以他们有一个类似的碰撞概率：

> 想要在十亿分之一的重复的可能性下找到重复，必须生成 1.03^15 个 v4 ID。


Nano ID 和 UUID v4 有两个主要的区别:

1. Nano ID 使用了一个更大的字符表，因此一个类似长度的随机位数可以被封装到 21 个字符里，而不是 36 个。
2. Nano ID 的代码体积大小比 `uuid/v4` 小三倍: 141 字节，而不是 435 字节。


## 性能基准（Benchmark）

```rust
$ ./test/benchmark
nanoid                    693,132 ops/sec
nanoid/generate           624,291 ops/sec
uid.sync                  487,706 ops/sec
uuid/v4                   471,299 ops/sec
secure-random-string      448,386 ops/sec
shortid                    66,809 ops/sec

Async:
nanoid/async              105,024 ops/sec
nanoid/async/generate     106,682 ops/sec
secure-random-string       94,217 ops/sec
uid                        92,026 ops/sec

Non-secure:
nanoid/non-secure       2,555,814 ops/sec
rndm                    2,413,565 ops/sec
```


## 安全性

*这里可以阅读一篇关于随机生成器理论的文章：[安全的随机数值（以 Node.js 为例）]*

### 不可预测性

Nano ID 使用了 `crypto` Node.js 模块和浏览器的 Web Crypto API，而不是不安全的 `Math.random()`。这些安全的模块使用了不可被预测的硬件随机生成器。


### Uniformity一致性

`random % alphabet` 是一个在编写一个 ID 生成器时常见的错误。
这种写法会使得分布不均匀，某些字符的出现率会比其他字符低，这会降低使用蛮力（brute-force）破解的时间。

Nano ID 使用了一个[更好的算法]，并被测试了字符分布的一致性。

<img src="img/distribution.png" alt="Nano ID 一致性"
     width="340" height="135">

[安全的随机数值（以 Node.js 为例）]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[更好的算法]: https://github.com/ai/nanoid/blob/master/format.js


## 工具

* 使用 [ID 大小计算器] 来根据你的情况选择 ID 大小。
* 用 [`nanoid-字典`] 选择常用的字符标，来配合使用 `nanoid/generate`。
* [`nanoid-cli`] 在命令行生存 ID.
* 用 [`nanoid-good`] 来保证你的 ID 里不会出现不好的词语。

[`nanoid-字典`]: https://github.com/CyberAP/nanoid-dictionary
[ID 大小计算器]:  https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-cli`]:        https://github.com/twhitbeck/nanoid-cli
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good


## 其他编程语言

* [C#](https://github.com/codeyu/nanoid-net)
* [Clojure, ClojureScript](https://github.com/zelark/nano-id)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart](https://github.com/pd4d10/nanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Haskell](https://github.com/4e6/nanoid-hs)
* [Java](https://github.com/aventrix/jnanoid)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid), [py-nanoid-dictionary](https://github.com/aidarkhanov/py-nanoid-dictionary)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)

另外， [CLI tool] 也可以用来在命令行里生成 ID。

[CLI tool]: https://github.com/twhitbeck/nanoid-cli


## 使用方法

### 常规

主模块使用 URL 友好型的字符 (`A-Za-z0-9_-`) 并返回长度为 21 的 ID (为了达到与 UUID v4 类似的碰撞概率)

```js
const nanoid = require('nanoid')
model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

字符 `-,.()` 不会在 URL 里转码，因为如果在链接末尾使用，他们会被识别成标点符号。

如果你想要降低 ID 长度 (并会提高碰撞概率)，你可以把长度作为参数传递进去。

```js
nanoid(10) //=> "IRFa-VaY2b"
```

不要忘记在我们的 [ID 碰撞概率计算器] 检查你的 ID 长度的安全性。

[ID 碰撞概率计算器]: https://alex7kom.github.io/nano-nanoid-cc/


### React Native

```js
const generateSecureRandom = require('react-native-securerandom').generateSecureRandom
const format = require('nanoid/async/format')
const url = require('nanoid/url')

async function createUser () {
  user.id = await format(generateSecureRandom, url, 21);
}
```


### Mongoose

```js
const mySchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(10)
  }
})
```


### Web Workers

Web Worker 无法获取安全的随机生成器。

安全性对于 ID 来说是非常重要的，ID 应当是不可被预测的。比如说 “通过链接获取” 的链接生成。

如果你不需要不可预测的 ID，但你需要支持 React Native 或 Web Workers，你可以使用不安全的 ID 生成器。

```js
const nanoid = require('nanoid/non-secure')
model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### 异步

为了生成硬件随机字节，CPU 将会收集电磁噪音。在收集期间，CPU 会停止工作。所以如果我们使用异步的硬件随机生成器接口，你的其他代码也可以在收集期间执行。

```js
const nanoid = require('nanoid/async')

async function createUser () {
  user.id = await nanoid()
}
```

不幸的事，在浏览器里你无法这么做，因为 Web Crypto API 没有异步接口。

### 定制字符表或长度

如果你想要改变生成 ID 的字符表或者长度，你可以使用未被高度封装的 `generate` 模块。

```js
const generate = require('nanoid/generate')
model.id = generate('1234567890abcdef', 10) //=> "4f90d13a42"
```

你可以使用我们的 [ID 碰撞概率计算器] 来检查你的字符表和 ID 长度的安全性。你也可以在 [`nanoid-字典`] 找到常用的字符表。

字符表必须小于等于 256 个字符，否则生成器会不再安全。

[ID 碰撞概率计算器]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-字典`]: https://github.com/CyberAP/nanoid-dictionary


### 定制随机字节生成器

你可以用 `format` 模块来替换默认的随机生成器。
举个例子，使用基于种子 (seed) 的生成器。

```js
const format = require('nanoid/format')

function random (size) {
  const result = []
  for (let i = 0; i < size; i++) {
    result.push(randomByte())
  }
  return result
}

format(random, "abcdef", 10) //=> "fbaefaadeb"
```

回调函数 `random` 接收数组长度并返回一个包含随机数字的该长度的数组。

如果你想在使用对 URL 友好的字符的同时使用 `format`，你可以从 `url` 文件里获取默认的字符表。

```js
const url = require('nanoid/url')
format(random, url, 10) //=> "93ce_Ltuub"
```
