# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | [日本語](./README.ja.md) | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md) | **한국어**

JavaScript를 위한 가볍고 안전하며 URL 친화적인 고유 String ID 생성기

> “대단한 레벨의 무의미한 완벽주의,
> 경의를 표하지 않을 수 없습니다”

* **가볍습니다.** 118 bytes (minified 및 brotli 적용 후). 다른 의존성이 없습니다.
  [Size Limit] 의 기능으로 컨트롤합니다.
* **안전합니다.** 하드웨어의 랜덤 생성기를 사용합니다. 클러스터에서 사용할 수 있습니다.
* **짧은 ID를 생성합니다.** UUID와는 다르게 대소문자를 모두 사용하여 키를 생성하므로, 36 byte를 차지하는 UUID와 다르게 21 byte만으로도 고유 아이디를 생성할 수 있습니다.
  So ID size was reduced from 36 to 21 symbols.
* **이식이 쉽습니다.** Nano ID 는 20개 이상의 언어로 포팅되었습니다 [다른 언어들](#다른-언어들).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[with Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit


## 목차

- [목차](#목차)
- [UUID와 비교](#uuid와-비교)
- [벤치마크](#벤치마크)
- [보안](#보안)
- [설치](#설치)
  - [ESM](#esm)
  - [CommonJS](#commonjs)
  - [JSR](#jsr)
  - [CDN](#cdn)
- [API](#api)
  - [Blocking](#blocking)
  - [Non-Secure](#non-secure)
  - [사용자 커스텀 문자열](#사용자-커스텀-문자열)
  - [사용자 지정 랜덤 바이트 생성기](#사용자-지정-랜덤-바이트-생성기)
- [사용법](#사용법)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDB 및 CouchDB](#pouchdb-및-couchdb)
  - [CLI](#cli)
  - [TypeScript](#typescript)
  - [다른 언어들](#다른-언어들)
- [도구](#도구)


## UUID와 비교

Nano ID 는 (랜덤 기반의) UUID v4와 비교할 수 있습니다.
아이디로 생성되는 랜덤 비트의 수가 유사하여
(Nano ID는 126개, UUID는 122개), 동일한 아이디가 생성될 수 있는 충돌 확률도 비슷합니다:

> 10억 분의 1의 확률로 충돌이 발생하기 위해서는
> 103조 번의 v4 ID가 생성되어야 합니다.

Nano ID와 UUID v4에는 두 가지의 주요한 차이점이 있습니다:

1. Nano ID는 대문자를 사용합니다. 그래서 유사한 개수의 랜덤 값을 36개가 아닌 21개의 문자로 나타낼 수 있습니다.
2. Nano ID 코드는 `uuid/v4` 패키지보다 **4분의 1 사이즈**입니다:
   UUIDv4는 423 bytes, Nano ID는 130 bytes 입니다.


## 벤치마크

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

테스트 환경: 프레임워크 13 7840U, 페도라 39, Node.js 21.6.


## 보안

*랜덤 생성기에 대한 설명은 다음 기사를 참고하세요:
[Secure random values (in Node.js)]*

* **예측불가성.** 안전하지 않은 `Math.random()`를 사용하는 대신, Nano ID는
  Node.js에서 제공하는 `crypto` 모듈과 브라우저의 Web Crypto API를 사용합니다.
  이 모듈들은 예측이 불가능한 하드웨어 레벨의 랜덤 생성기입니다.
* **균일성.** `random % alphabet` 는 랜덤 아이디 생성기를 만들때 흔히들 하는 실수입니다.
  이 경우 분포(수학)가 일정하지 않게 되며, 일부 기호들은 다른 기호들보다 사용될 확률이 낮아집니다.
  이로 인해 브루트포스를 사용한 시도의 횟수를 줄일 수 있는 결과를 가져옵니다.
  Nano ID는 [이보다 더 좋은 알고리즘]을 사용하며, 균일성 테스트를 수행하였습니다.

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">

* **문서화:** Nano ID의 모든것이 코드에 문서화되어있습니다. [소스 코드]에서 코멘트를 확인하세요.
* **취약점:** 보안 취약점에 대한 리포트는 아래 링크를 사용해주세요.
  [Tidelift security contact](https://tidelift.com/security).
  Tidelift에서 취약점에 대한 수정 및 알림등을 도와줄 수 있습니다.

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[이보다 더 좋은 알고리즘]:                  https://github.com/ai/nanoid/blob/main/index.js
[소스 코드]:                        https://github.com/ai/nanoid/blob/main/index.js


## 설치

### ESM

Nano ID 5는 ESM 프로젝트에서 `import`를 사용하여 테스트코드나 Node.js 스크립트에 사용할 수 있습니다.

```bash
npm install nanoid
```

### CommonJS

Nano ID는 아래와 같은 방법으로 CommonJS에 사용할 수 있습니다:

- `require()`를 사용해 Nano ID를 가져올 수 있습니다.
  최신 Node.js 22.12나 Node.js 20에서 `--experimental-require-module`
  플래그를 이용하면 사용할 수 있습니다.

- Node.js 18에서는 아래의 방법으로 동적 임포트를 해주세요:

  ```js
  let nanoid
  module.exports.createID = async () => {
    if (!nanoid) ({ nanoid } = await import('nanoid'))
    return nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
  }
  ```

- Nano ID 3.x 역시 설치할 수 있습니다 (아직 지원중이에요!):

  ```bash
  npm install nanoid@3
  ```

### JSR

[JSR](https://jsr.io) 은 npm을 대체할 수 있는 오픈 거버넌스이며 npm과 달리 현재 활발히 개발중에 있습니다.

```bash
npx jsr add @sitnik/nanoid
```

Node.js, Deno, Bun 등에서 사용할 수 있습니다.

```js
// 모든 `nanoid` import를 `@sitnik/nanoid`로 변경합니다
import { nanoid } from '@sitnik/nanoid'
```

Deno 사용시에는 `deno add jsr:@sitnik/nanoid` 명령어로 설치하고
`jsr:@sitnik/nanoid`로 import 합니다.


### CDN

빠른 적용을 위해 CDN에서 Nano ID를 가져올 수 있습니다.
하지만 로딩 성능이 늦어지므로 프로덕션에서는 사용하는 것을 추천하지 않습니다.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```

## API

Nano ID는 normal / non-secure의 2가지의 API를 제공합니다.

기본적으로 Nano ID는 URL에 친화적인 기호들을 사용하여 21자리의 랜덤한 문자열을 생성합니다.
(이들은 UUID v4와 유사한 중복생성 확률을 가집니다)


### Blocking

Nano ID를 사용하는 가장 안전하고 쉬운 방법입니다.

드물게 CPU가 하드웨어 랜덤 생성을 위해 노이즈 제거를 수행하는 동안 다른 동작을 못하도록 블로킹 될 수 있습니다.

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

생성되는 랜덤 아이디의 크기를 줄이고 싶으면 파라미터로 해당 길이 값을 넣어주면 됩니다.
(이렇게 하면 중복 생성이 발생할 확률도 올라갑니다)

```js
nanoid(10) //=> "IRFa-VaY2b"
```

아래의 [아이디 중복확률] 계산기로 여러분의 아이디가 얼마나 안전한지 확인해보세요.

[사용자 커스텀 문자열](#사용자-커스텀-문자열) 이나
[사용자가 만든 랜덤 생성기](#사용자-지정-랜덤-바이트-생성기) 를 사용할 수도 있습니다.

[아이디 중복확률]: https://zelark.github.io/nano-id-cc/


### Non-Secure

기본적으로 Nano ID는 보안과 낮은 충돌 확률을 위해 하드웨어 랜덤 바이트 생성기를 사용합니다.
만약 보안이 중요하지 않다면 하드웨어 랜덤 생성기를 사용하지 않도록 설정할 수 있습니다.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### 사용자 커스텀 문자열

`customAlphabet` 함수를 사용하면 지정된 문자열 내에서 지정된 개수로 이루어진
랜덤 아이디를 생성할 수 있는 `nanoid` 함수를 만들 수 있습니다

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

[아이디 충돌 확률] 계산기를 사용하여 여러분이 지정한 문자와 사이즈에 대한 중복 생성 확률을 확인해보세요.
[`nanoid-dictionary`] 에서 어떤 문자열을 사용할 수 있는지에 대한 옵션을 확인할 수 있습니다.

커스텀 문자열은 256개 이하의 개수를 가져야 합니다.
그 외의 경우 내부의 생성 알고리즘의 보안성을 보장할 수 없습니다.

기본 사이즈를 지정한 후에, 새로 만들어진 함수를 부를 때 생성할 문자열의 개수를 다시 지정하는 것도 가능합니다

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[아이디 충돌 확률]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-dictionary`]:      https://github.com/CyberAP/nanoid-dictionary


### 사용자 지정 랜덤 바이트 생성기

`customRandom` 함수를 사용하면 `nanoid`에서 사용할 문자열과 알고리즘을 지정할 수 있습니다.

아래 예시는 시드 값을 기반으로 하는 랜덤 생성기를 사용하였습니다.

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

콜백 함수 `random` 는 반드시 배열의 크기를 받을 수 있어야 하며, 랜덤 숫자로 이루어진 배열을 리턴해야 합니다.

URL 친화적인 기호들을 사용하여 `customRandom` 을 실행하려면,
`urlAlphabet`을 사용해 기본 문자셋을 가져올 수 있습니다.

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

참고로, Nano ID 버전이 변경됨에 따라 랜덤 생성기의 호출 시퀀스가 변경될 수 있습니다.
시드기반 생성기를 사용하는 경우 동일한 결과가 나오는 것을 보장할 수 없습니다.


## 사용법

### React

React에서 `key` props에 Nano ID를 사용하는 것은 좋지 않습니다.
이 값은 렌더링 될 때마다 동일한 값을 가지고 있어야 합니다.

```jsx
function Todos({todos}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* 절대 하지 마세요 */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

랜덤값보다 리스트 내에서 가져올 수 있는 값을 사용하여 안정된 값을 키 값으로 사용하는 것이 좋습니다.

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

`key` 값으로 사용할 적절한 값이 없는 경우에도 `nanoid()`를 사용하기 보다는 인덱스 값을 사용하세요:

```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* 추천되는 방식은 아니지만 nanoid()를 쓰는것 보단 낫습니다 */
    {text}
  </li>
)
```

랜덤한 아이디를 생성하여 HTML 요소간의 연결 (label과 input 등)에 사용하는 경우에는
React 18에서 추가된 [`useId`] 를 추천합니다.

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native

React Native에는 내장된 랜덤 생성기가 존재하지 않습니다.
아래의 폴리필을 사용하면 순수 React Native와 Expo(`39`버전 이상) 환경에서
Nano ID를 사용할 수 있습니다.

1. [`react-native-get-random-values`] 문서를 확인하고 설치합니다
2. Nano ID를 import하기 전에 이 패키지를 import 해야 합니다.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### PouchDB 및 CouchDB

PouchDB와 CouchDB에서는 ID 값을 `_`로 시작할 수 없습니다.
Nano ID는 기본적으로 `_`를 맨 앞에 붙일 수 있기 때문에,
이 문제를 해결하기 위해 접두어 (prefix)가 필요합니다.

아래와 같이 접두어를 붙여서 사용합니다.

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### CLI

터미널에서 `npx nanoid` 명령어를 입력하면 고유 ID를 생성할 수 있습니다.
Node.js가 시스템에 설치되어있어야 하며, Nano ID는 미리 설치되어있지 않아도 됩니다.

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

생성할 아이디의 길이를 변경하려면 `--size` (or `-s`) 옵션을 붙여줍니다:

```sh
$ npx nanoid --size 10
L3til0JS4z
```

사용자 커스텀 문자열을 사용하려면 `--alphabet` (or `-a`) 옵션을 사용합니다
(이 때 `--size`도 같이 사용해야 합니다):

```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```

### TypeScript

Nano ID는 생성된 문자열을 TypeScript의 순수 string이 아닌 타입에도 할당할 수 있습니다.
예를 들어 아래와 같이 가능합니다:

```ts
declare const userIdBrand: unique symbol
type UserId = string & { [userIdBrand]: true }

// 명시적으로 타입 파라미터를 사용:
mockUser(nanoid<UserId>())

interface User {
  id: UserId
  name: string
}

const user: User = {
  // 자동으로 UserId 타입으로 캐스팅됨:
  id: nanoid(),
  name: 'Alice'
}
```

### 다른 언어들

Nano ID는 다양한 언어로 포팅되었습니다. 클라이언트/서버에 관계없이 아래의 다양한 포팅된 버전들을 사용할 수 있습니다.

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
* Python [native](https://github.com/puyuan/py-nanoid) implementation
  with [dictionaries](https://pypi.org/project/nanoid-dictionary)
  and [fast](https://github.com/oliverlambson/fastnanoid) implementation (written in Rust)
* Postgres [Extension](https://github.com/spa5k/uids-postgres)
  and [Native Function](https://github.com/viascom/nanoid-postgres)
* [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
* [V](https://github.com/invipal/nanoid)
* [Zig](https://github.com/SasLuca/zig-nanoid)

이 외의 환경에서는 [CLI]를 사용하여 터미널 환경에서 랜덤 아이디를 생성할 수 있습니다.

[CLI]: #cli


## 도구

* [ID 사이즈 계산기]는 문자열과 생성 사이즈를 변경한 경우 중복된 아이디가 생성될 수 있는 충돌 확률을 알려줍니다.
* [`customAlphabet`]에서 사용할 수 있는 일반적인 문자열들을 [`nanoid-dictionary`]로 찾아볼 수 있습니다.
* 생성된 ID에 이상한 단어가 들어가는 것을 방지하려면 [`nanoid-good`]를 사용할 수 있습니다.

[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID 사이즈 계산기]:  https://zelark.github.io/nano-id-cc/
[`customAlphabet`]:    #custom-alphabet-or-size
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
