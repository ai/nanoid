# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | **日本語** | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md) | [한국어](./README.ko.md)

JavaScriptのための小さく、安全で、URL友好的なユニークな文字列ID生成器。

> 「意味不明なレベルの完璧主義、
> これは尊敬せざるを得ない。」

* **小さい。** 118バイト（圧縮・brotli圧縮後）。依存関係なし。
  [Size Limit]がサイズを管理。
* **安全。** ハードウェア乱数生成器を使用。クラスタでも利用可能。
* **短いID。** UUIDより大きなアルファベット（A-Za-z0-9_-）を使用。
  そのためID長は36から21文字に短縮されています。
* **移植性。** Nano IDは[20以上のプログラミング言語](./README.md#other-programming-languages)に移植されています。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[with Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit


## 目次

- [目次](#目次)
- [UUIDとの比較](#uuidとの比較)
- [ベンチマーク](#ベンチマーク)
- [セキュリティ](#セキュリティ)
- [インストール](#インストール)
  - [ESM](#esm)
  - [CommonJS](#commonjs)
  - [JSR](#jsr)
  - [CDN](#cdn)
- [API](#api)
  - [ブロッキング](#ブロッキング)
  - [非セキュア](#非セキュア)
  - [カスタムアルファベットまたはサイズ](#カスタムアルファベットまたはサイズ)
  - [カスタムランダムバイト生成器](#カスタムランダムバイト生成器)
- [使用方法](#使用方法)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDBとCouchDB](#pouchdbとcouchdb)
  - [CLI](#cli)
  - [TypeScript](#typescript)
  - [その他のプログラミング言語](#その他のプログラミング言語)
- [ツール](#ツール)


## UUIDとの比較

Nano IDはUUID v4（ランダムベース）と十分に比較可能です。
ID内のランダムビット数は同様です（Nano IDで126ビット、UUIDで122ビット）、
そのため衝突確率も同様です：

> 10億分の1の確率で重複が発生するには、
> 103兆個のバージョン4 IDを生成する必要があります。

Nano IDとUUID v4の主な違いは2つあります：

1. Nano IDはより大きなアルファベットを使用するため、同様のランダムビット数が
   36文字ではなく21文字に詰め込まれています。
2. Nano IDのコードはuuid/v4パッケージより**4倍小さい**です：
   423バイトではなく130バイトです。


## ベンチマーク

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

テスト構成：Framework 13 7840U, Fedora 39, Node.js 21.6.


## セキュリティ

*乱数生成器の理論に関する良い記事を参照してください：
[Secure random values (in Node.js)]*

* **予測不可能性。** 安全でないMath.random()を使う代わりに、Nano IDは
  Node.jsではcryptoモジュールを、ブラウザではWeb Crypto APIを使用します。
  これらのモジュールは予測不可能なハードウェア乱数生成器を使用します。
* **均一性。** random % alphabetはID生成器をコーディングする際によくある間違いです。
  分布は均一ではなく、一部の記号が他のものより出現確率が低くなります。
  そのため、総当たり攻撃の際に試行回数が減少します。Nano IDは[より良いアルゴリズム]を
  使用し、均一性についてテストされています。

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

* **十分に文書化されている：** Nano IDのすべてのハックは文書化されています。
  [ソース]のコメントを参照してください。
* **脆弱性：** セキュリティの脆弱性を報告するには、
  [Tideliftセキュリティ連絡先](https://tidelift.com/security)を使用してください。
  Tideliftが修正と開示を調整します。

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[より良いアルゴリズム]:                  https://github.com/ai/nanoid/blob/main/index.js
[ソース]:                        https://github.com/ai/nanoid/blob/main/index.js


## インストール

### ESM

Nano ID 5はESMプロジェクト（importを使用）のテストやNode.jsスクリプトで動作します。

```bash
npm install nanoid
```

### CommonJS

Nano IDは以下のいずれかの方法でCommonJSで使用できます：

- require()を使用してNano IDをインポートできます。最新のNode.js 22.12
  （標準で動作）またはNode.js 20（--experimental-require-moduleオプション付き）が必要です。

- Node.js 18では、次のようにNano IDを動的にインポートできます：

  ```js
  let nanoid
  module.exports.createID = async () => {
    if (!nanoid) ({ nanoid } = await import('nanoid'))
    return nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
  }
  ```

- Nano ID 3.xを使用できます（まだサポートしています）：

  ```bash
  npm install nanoid@3
  ```

### JSR

[JSR](https://jsr.io)はオープンなガバナンスと積極的な開発（npmとは対照的に）を持つnpmの代替です。

```bash
npx jsr add @sitnik/nanoid
```

Node.js、Deno、Bunなどで使用できます。

```js
// すべてのインポートで`nanoid`を`@sitnik/nanoid`に置き換える
import { nanoid } from '@sitnik/nanoid'
```

Denoでは、`deno add jsr:@sitnik/nanoid`でインストールするか、
`jsr:@sitnik/nanoid`からインポートします。


### CDN

クイックハックの場合、CDNからNano IDを読み込むことができます。ただし、読み込みパフォーマンスが低いため、本番環境での使用はお勧めしません。

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```

## API

Nano IDには2つのAPI：通常と非セキュアがあります。

デフォルトでは、Nano IDはURL友好的な記号（A-Za-z0-9_-）を使用し、
21文字のID（UUID v4と同様の衝突確率を持つ）を返します。


### ブロッキング

Nano IDを使用する安全で最も簡単な方法です。

まれに、ハードウェア乱数生成器のノイズ収集中にCPUを他の作業からブロックする場合があります。

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

IDのサイズを小さくしたい場合（衝突確率を高める）、
サイズを引数として渡すことができます。

```js
nanoid(10) //=> "IRFa-VaY2b"
```

IDサイズの安全性を[ID衝突確率]計算機で確認することを忘れないでください。

[カスタムアルファベット](#カスタムアルファベットまたはサイズ)や
[ランダム生成器](#カスタムランダムバイト生成器)も使用できます。

[ID衝突確率]: https://zelark.github.io/nano-id-cc/


### 非セキュア

デフォルトでは、Nano IDはセキュリティと低衝突確率のためにハードウェアランダムバイト生成を使用します。セキュリティにそれほど関心がない場合は、ハードウェア乱数生成器がない環境でも使用できます。

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### カスタムアルファベットまたはサイズ

customAlphabetは、独自のアルファベットとIDサイズでnanoidを作成できる関数を返します。

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

カスタムアルファベットとIDサイズの安全性を[ID衝突確率]計算機で確認してください。
より多くのアルファベットについては、[nanoid-dictionary]のオプションを確認してください。

アルファベットは256記号以下でなければなりません。
そうでない場合、内部生成アルゴリズムのセキュリティは保証されません。

デフォルトサイズを設定するだけでなく、関数を呼び出す際にIDサイズを変更することもできます：

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[ID衝突確率]: https://alex7kom.github.io/nano-nanoid-cc/
[nanoid-dictionary]:      https://github.com/CyberAP/nanoid-dictionary


### カスタムランダムバイト生成器

customRandomを使用すると、nanoidを作成し、アルファベットとデフォルトのランダムバイト生成器を置き換えることができます。

この例では、シードベースの生成器が使用されています：

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

randomコールバックは配列サイズを受け取り、ランダムな数値の配列を返す必要があります。

customRandomで同じURL友好的な記号を使用したい場合は、urlAlphabetを使用してデフォルトのアルファベットを取得できます。

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

なお、Nano IDのバージョン間でランダム生成器の呼び出しシーケンスが変更される場合があります。シードベースの生成器を使用している場合、同じ結果を保証するものではありません。


## 使用方法

### React

Reactの`key` propにNano IDを使用する正しい方法はありません。なぜなら、keyはレンダー間で一貫性がある必要があるからです。

```jsx
function Todos({todos}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* これはやめましょう */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

代わりに、リストアイテム内で安定したIDを使用するようにしましょう。

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

安定したIDがない場合は、`nanoid()`の代わりにインデックスを`key`として使用することをお勧めします：

```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* まだ推奨されませんが、nanoid()よりは優先されます。
                       アイテムに安定したIDがない場合のみ行ってください。 */
    {text}
  </li>
)
```

ラベルと入力フィールドのように要素を関連付けるためだけにランダムなIDが必要な場合は、[`useId`]が推奨されます。
このフックはReact 18で追加されました。

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native

React Nativeには組み込みのランダム生成器がありません。次のポリフィルは
プレーンなReact NativeとExpo（`39.x`以降）で動作します。

1. [`react-native-get-random-values`]のドキュメントを確認し、インストールします。
2. Nano IDの前にインポートします。

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### PouchDBとCouchDB

PouchDBとCouchDBでは、IDはアンダースコア`_`で始めることができません。
Nano IDはデフォルトでIDの先頭に`_`を使用する可能性があるため、
この問題を防ぐためにプレフィックスが必要です。

次のオプションでデフォルトのIDを上書きします：

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### CLI

ターミナルで`npx nanoid`を呼び出すことで、一意のIDを取得できます。
システムにNode.jsがあれば十分で、Nano IDをどこかにインストールする必要はありません。

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

生成されるIDのサイズは`--size`（または`-s`）オプションで指定できます：

```sh
$ npx nanoid --size 10
L3til0JS4z
```

カスタムアルファベットは`--alphabet`（または`-a`）オプションで指定できます
（この場合、`--size`が必須であることに注意してください）：

```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```

### TypeScript

Nano IDでは、生成された文字列をTypeScriptで不透明な文字列（opaque strings）にキャストできます。
例えば：

```ts
declare const userIdBrand: unique symbol
type UserId = string & { [userIdBrand]: true }

// 明示的な型パラメータを使用：
mockUser(nanoid<UserId>())

interface User {
  id: UserId
  name: string
}

const user: User = {
  // 自動的にUserIdにキャストされます：
  id: nanoid(),
  name: 'Alice'
}
```

### その他のプログラミング言語

Nano IDは多くの言語に移植されています。これらのポートを使用して、
クライアント側とサーバー側で同じID生成器を持つことができます。

* [C](https://github.com/lukateras/nanoid.h)
* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure and ClojureScript](https://github.com/zelark/nano-id)
* [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Gleam](https://github.com/0xca551e/glanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Haskell](https://github.com/MichelBoucey/NanoID)
* [Haxe](https://github.com/flashultra/uuid)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/wosherco/jnanoid-enhanced)
* [Kotlin](https://github.com/viascom/nanoid-kotlin)
* [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [OCaml](https://github.com/routineco/ocaml-nanoid)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* Python [ネイティブ](https://github.com/puyuan/py-nanoid)実装
  [辞書](https://pypi.org/project/nanoid-dictionary)付きと
  [高速](https://github.com/oliverlambson/fastnanoid)実装（Rustで書かれています）
* Postgres [拡張機能](https://github.com/spa5k/uids-postgres)
  と[ネイティブ関数](https://github.com/viascom/nanoid-postgres)
* [R](https://github.com/hrbrmstr/nanoid)（辞書付き）
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
* [V](https://github.com/invipal/nanoid)
* [Zig](https://github.com/SasLuca/zig-nanoid)

その他の環境では、コマンドラインからIDを生成するための[CLI]が利用可能です。

[CLI]: #cli


## ツール

* [IDサイズ計算機]は、IDのアルファベットやサイズを調整する際の衝突確率を表示します。
* [`nanoid-dictionary`]は[`customAlphabet`]で使用する一般的なアルファベットを提供します。
* [`nanoid-good`]はIDに不適切な単語が含まれていないことを確認します。

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[IDサイズ計算機]:  https://zelark.github.io/nano-id-cc/
[`customAlphabet`]:    #カスタムアルファベットまたはサイズ
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
