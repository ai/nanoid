# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Логотип Nano ID от Антона Ловчикова" width="180" height="94">

[English](./README.md) | [日本語](./README.ja.md) | **Русский** | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md) | [한국어](./README.ko.md)

Генератор уникальных ID для JavaScript — лёгкий, безопасный,
ID можно применять в URL.

> «Поразительный уровень бессмысленного перфекционизма,
> который просто невозможно не уважать»

- **Лёгкий.** 118 байт (после минификации и Brotli). Без зависимостей.
  [Size Limit] следит за размером.
- **Безопасный.** Использует аппаратный генератор случайных чисел.
  Можно использовать в кластерах машин.
- **Короткие ID.** Используется больший алфавит, чем у UUID (`A-Za-z0-9_-`).
  Поэтому длина ID уменьшена с 36 до 21 символа.
- **Работает везде.** Nano ID уже портировали
  на [20 языков программирования](#другие-языки-программирования).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Поддерживает современные браузеры, IE ([с Babel]), Node.js и React Native.

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[с babel]: https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[size limit]: https://github.com/ai/size-limit

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Сделано в <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Злых марсианах</a></b>, продуктовом консалтинге для <b>инструментов разработки</b>.

---


## Оглавление

- [Оглавление](#оглавление)
- [Сравнение с UUID](#сравнение-с-uuid)
- [Сравнение производительности](#сравнение-производительности)
- [Безопасность](#безопасность)
- [Подключение](#подключение)
  - [ESM](#esm)
  - [CommonJS](#commonjs)
  - [JSR](#jsr)
  - [CDN](#cdn)
- [API](#api)
  - [Блокирующий](#блокирующий)
  - [Небезопасный](#небезопасный)
  - [Смена алфавита или длины](#смена-алфавита-или-длины)
  - [Смена генератора случайных чисел](#смена-генератора-случайных-чисел)
- [Руководство](#руководство)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDB и CouchDB](#pouchdb-и-couchdb)
  - [Терминал](#терминал)
  - [TypeScript](#typescript)
  - [Другие языки программирования](#другие-языки-программирования)
- [Инструменты](#инструменты)


## Сравнение с UUID

Nano ID похож на UUID v4 (случайный).
У них сравнимое число битов случайности в ID (126 у Nano ID против 122 у UUID),
поэтому они обладают похожей вероятностью возникновения коллизий
(повторной генерации ранее выданных ID):

> Чтобы вероятность повтора приблизилась к 1 на миллиард,
> нужно сгенерировать 103 триллиона ID.

Но между ними есть 2 важных отличия:

1. Nano ID использует более широкий алфавит, и сравнимое количество
   битов случайности будут упакованы в более короткую строку
   (21 символ, против 36 у UUID).
2. Код Nano ID **в 4 раз меньше**, чем у `uuid/v4` — 130 байт против 423.


## Сравнение производительности

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

Среда сравнения: Framework 13 7840U, Fedora 39, Node.js 21.6.


## Безопасность

_См. также хорошую статью о теориях генераторов случайных чисел:
[Secure random values (in Node.js)]_

- **Непредсказуемость.** Вместо предсказуемого `Math.random()`, Nano ID
  использует модуль `crypto` в Node.js и Web Crypto API в браузере.
  Эти модули дают доступ к аппаратному генератору случайных чисел.
- **Равномерность.** Например, существует популярная ошибка `random % alphabet`,
  которую часто допускают при разработке генератора ID.
  Распределение вероятности для каждого символа может не быть одинаковым.
  Из-за неравномерности использования пространства алфавита, на перебор ID
  потребуется меньше времени, чем ожидается.
  Nano ID использует [более совершенный алгоритм],
  а равномерность распределения символов покрыта тестами.

  <img src="img/distribution.png" alt="Распределение Nano ID"
     width="340" height="135">

- **Документация:** все хитрости Nano ID хорошо документированы — смотрите
  комментарии [в исходниках].
- **Уязвимости:** если вы нашли уязвимость в Nano ID, свяжитесь с
  [командой безопасности Tidelift](https://tidelift.com/security).
  Они проконтролируют исправление и проинформируют пользователей.

[secure random values (in node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[более совершенный алгоритм]: https://github.com/ai/nanoid/blob/main/index.js
[в исходниках]: https://github.com/ai/nanoid/blob/main/index.js


## Подключение

### ESM

Nano ID 5 работает с ESM-проектами (`import`) в тестах или скриптах для Node.js.

```bash
npm install nanoid
```

### CommonJS

На проектах с CommonJS вы можете использовать:

- `require()` будет работать в последней версия Node.js 22.12 (из коробки)
  или Node.js 20 (с флагом `--experimental-require-module`).

- В более старых версиях Node.js можно использовать динамический импорт:

  ```js
  let nanoid
  module.exports.createID = async () => {
    if (!nanoid) ({ nanoid } = await import('nanoid'))
    return nanoid() // => "V1StGXR8_Z5jdHi6B-myT"
  }
  ```

- Или можно просто взять Nano ID 3.x (мы его всё ещё поддерживаем):

  ```bash
  npm install nanoid@3
  ```

### JSR

[JSR](https://jsr.io) это замена npm с открытым управлением
и активной разработкой (в отличие от npm).

```bash
npx jsr add @sitnik/nanoid
```

Вы можете использовать пакет с JSR в Node.js, Deno, Bun.

```js
// Replace `nanoid` to `@sitnik/nanoid` in all imports
import { nanoid } from '@sitnik/nanoid'
```

Для Deno установите через `deno add jsr:@sitnik/nanoid`
или импортируйте `jsr:@sitnik/nanoid`.


### CDN

Для быстрого прототипирования вы можете подключить Nano ID с CDN без установки.
Не используйте этот способ на реальном сайте, так как он сильно бьёт
по скорости загрузки сайта.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


## API

Nano ID разделён на два модуля: стандартный и небезопасный.

По умолчанию используются символы, безопасные для URL (`A-Za-z0-9_-`).
Длина ID по умолчанию — 21 символ
(чтобы вероятность коллизий была соизмеримой с UUID v4).


### Блокирующий

Безопасный и простой в использовании способ использования Nano ID.

Из-за особенностей работы генератора случайных чисел при использовании этого
способа ЦПУ может иногда простаивать без работы.

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Функция также принимает необязательный аргумент, задающий длину ID:

```js
nanoid(10) //=> "IRFa-VaY2b"
```

При изменении размера, всегда проверяйте риски
в нашем [калькуляторе коллизий](https://zelark.github.io/nano-id-cc/).


### Небезопасный

По умолчанию, Nano ID использует аппаратный генератор случайных чисел для
получения непредсказуемых ID и минимизации риска возникновения коллизий
(повторной генерации ранее выданных ID). Но если вам не требуется устойчивость
к подбору ID, то вы можете перейти на небезопасный генератор — это полезно
там, где нет доступа к API аппаратного генератора случайных чисел.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

Но учтите, что предсказуемость ID может быть использована для атаки на систему.


### Смена алфавита или длины

Функция `customAlphabet` позволяет создать свою функцию `nanoid`
с нужным вам алфавитом и длиной ID.

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
user.id = nanoid() //=> "4f90d13a42"
```

```js
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdef', 10)
user.id = nanoid()
```

Не забудьте проверить риски коллизии вашего алфавита и длины
[на нашем калькуляторе]. [`nanoid-dictionary`] содержит много популярных
примеров альтернативных алфавитов.

Алфавит должен содержать ≤256 символов. Иначе мы не сможем гарантировать
непредсказуемость ID.

Длину ID можно менять не только в `customAlphabet()`, но и при вызове
генератора, который она вернёт:

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[на нашем калькуляторе]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary


### Смена генератора случайных чисел

Функция `customRandom` позволяет создать свою функцию `nanoid` со своими
генераторами случайных чисел, алфавитом и длинной ID.

Например, можно использовать генератор c seed для повторяемости тестов.

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return new Uint8Array(size).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

Функция в третьем аргументе `customRandom` должна принимать длину массива
и возвращать нужный массив со случайными числами

Если вы хотите заменить только генератор случайных чисел, но оставить
URL-совместимый алфавит, то стандартный алфавит доступен
в экспорте `urlAlphabet`.

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```


## Руководство

### React

Не используйте Nano ID для генерации свойства `key` в JSX. При каждом рендере
`key` будет разный, что плохо скажется на производительности.

```jsx
function Todos({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* НЕ ДЕЛАЙТЕ ТАК */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

Для связи `<input>` и `<label>` лучше использовать [`useId`],
который был добавлен в React 18.

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native

React Native не имеет встроенного аппаратного генератора случайных чисел.
Полифил ниже работает в чистом React Native и в Expo начиная с версии 39.

1. Прочитайте документацию [`react-native-get-random-values`] и установите его.
2. Импортируйте эту библиотеку до импорта Nano ID.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### PouchDB и CouchDB

В PouchDB и CouchDB, ID не могут начинаться с `_`. Добавьте к ID префикс,
так как иногда Nano ID может сгенерировать ID начинающийся с `_`.

Изменить стандартный ID можно через следующую опцию:

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### Терминал

Можно сгенерировать уникальный ID прямо из терминала, вызвав `npx nanoid`.
Для этого в системе должна быть только Node.js. `npx` сама скачает Nano ID,
если его нет в системе.

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

Длину генерируемых ID можно передать в аргументе `--size` (или `-s`):

```sh
$ npx nanoid --size 10
L3til0JS4z
```

Изменить алфавит можно при помощи аргумента `--alphabet` (ли `-a`)
(в этом случае `--size` обязателен):

```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```

### TypeScript

Nano ID позволяет приводить сгенерированные строки к непрозрачным строкам в
TypeScript. Например:

```ts
declare const userIdBrand: unique symbol
type UserId = string & { [userIdBrand]: true }

// Используйте явный параметр типа:
mockUser(nanoid<UserId>())

interface User {
  id: UserId
  name: string
}

const user: User = {
  // Автоматически приводится к типу UserId:
  id: nanoid(),
  name: 'Alice'
}
```

### Другие языки программирования

Nano ID был портирован на множество языков. Это полезно, чтобы сервер и клиент
генерировали ID по одной схеме.

- [C#](https://github.com/codeyu/nanoid-net)
- [C++](https://github.com/mcmikecreations/nanoid_cpp)
- [Clojure и ClojureScript](https://github.com/zelark/nano-id)
- [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
- [Crystal](https://github.com/mamantoha/nanoid.cr)
- [Dart и Flutter](https://github.com/pd4d10/nanoid-dart)
- [Elixir](https://github.com/railsmechanic/nanoid)
- [Gleam](https://github.com/0xca551e/glanoid)
- [Go](https://github.com/jaevor/go-nanoid)
- [Haskell](https://github.com/MichelBoucey/NanoID)
- [Haxe](https://github.com/flashultra/uuid)
- [Janet](https://sr.ht/~statianzo/janet-nanoid/)
- [Java](https://github.com/wosherco/jnanoid-enhanced)
- [Kotlin](https://github.com/viascom/nanoid-kotlin)
- [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
- [Nim](https://github.com/icyphox/nanoid.nim)
- [Perl](https://github.com/tkzwtks/Nanoid-perl)
- [PHP](https://github.com/hidehalo/nanoid-php)
- [Python](https://github.com/puyuan/py-nanoid)
  со [словарями](https://pypi.org/project/nanoid-dictionary)
- Postgres: [Rust-расширение](https://github.com/spa5k/uids-postgres)
  и [на чисто pgSQL](https://github.com/viascom/nanoid-postgres)
- [R](https://github.com/hrbrmstr/nanoid) (со словарями)
- [Ruby](https://github.com/radeno/nanoid.rb)
- [Rust](https://github.com/nikolay-govorov/nanoid)
- [Swift](https://github.com/ShivaHuang/swift-nanoid)
- [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
- [V](https://github.com/invipal/nanoid)
- [Zig](https://github.com/SasLuca/zig-nanoid)

Для остальных сред можно использовать Nano ID [для терминала].

[для терминала]: #терминал


## Инструменты

- [Калькулятор длины ID] поможет подобрать оптимальную длину ID,
  в зависимости от частоты выдачи ID и нужной надёжности системы.
- [`nanoid-dictionary`] с популярными алфавитами для [`customAlphabet`].
- [`nanoid-good`] гарантирует, что в случайном ID не будет матерных слов.

[калькулятор длины id]: https://zelark.github.io/nano-id-cc/
[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[`customalphabet`]: #смена-алфавита-или-длины
[`nanoid-good`]: https://github.com/y-gagar1n/nanoid-good
