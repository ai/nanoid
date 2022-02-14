# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Логотип Nano ID от Антона Ловчикова" width="180" height="94">

[English](./README.md) | **Русский** | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md)

Генератор уникальных ID для JavaScript — лёгкий, безопасный,
ID можно применять в URL.

> «Поразительный уровень бессмысленного перфекционизма,
> который просто невозможно не уважать»

- **Лёгкий.** 130 байт (после минификации и gzip). Без зависимостей.
  [Size Limit] следит за размером.
- **Быстрый.** В 2 раза быстрее UUID.
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

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="При поддержке Злых марсиан" width="236" height="54">
</a>


## Оглавление

- [Сравнение с UUID](#сравнение-с-uuid)
- [Сравнение производительности](#сравнение-производительности)
- [Безопасность](#безопасность)
- [Подключение](#подключение)
- [API](#api)
  - [Блокирующий](#блокирующий)
  - [Асинхронный](#асинхронный)
  - [Небезопасный](#небезопасный)
  - [Смена алфавита или длины](#смена-алфавита-или-длины)
  - [Смена генератора случайных чисел](#смена-генератора-случайных-чисел)
- [Руководство](#руководство)
  - [IE](#ie)
  - [React](#react)
  - [React Native](#react-native)
  - [Rollup](#rollup)
  - [PouchDB и CouchDB](#pouchdb-и-couchdb)
  - [Mongoose](#mongoose)
  - [Веб-воркеры](#веб-воркеры)
  - [Терминал](#терминал)
  - [Другие языки программирования](#другие-языки-программирования)
- [Инструменты](#инструменты)


## Сравнение с UUID

Nano ID похож на UUID v4 (случайный).
У них сравнимое число битов случайности в ID (126 у Nano ID против 122 у UUID),
поэтому они обладают похожей вероятностью возникновения коллизий
(повторной генерации ранее выданных ID):

> Чтобы вероятность повтора приблизилась к 1 на миллиард,
> нужно сгенерировать 103 триллиона ID.

Но между ними есть 3 важных отличия:

1. Nano ID использует более широкий алфавит, и сравнимое количество
   битов случайности будут упакованы в более короткую строку
   (21 символ, против 36 у UUID).
2. Код Nano ID **в 4 раз меньше**, чем у `uuid/v4` — 130 байт против 483.
3. Благодаря оптимизациям с выделением памяти,
   Nano ID **в 2 раза быстрее** UUID.


## Сравнение производительности

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

Среда сравнения: ThinkPad X1 Carbon Gen 9, Fedora 34, Node.js 16.10.


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

```bash
npm install --save nanoid
```

Для быстрого прототипирования вы можете подключить Nano ID с CDN без установки.
Не используйте этот способ на реальном сайте, так как он сильно бьёт
по скорости загрузки сайта.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```

Nano ID поддерживает ES-модули. Вам не надо ничего делать, чтобы ES-импорты
работали в webpack, Rollup, Parcel, или Node.js.

```js
import { nanoid } from 'nanoid'
```

Для Node.js также поддерживается CommonJS-импорт:

```js
const { nanoid } = require('nanoid')
```


## API

Nano ID разделён на три модуля:
стандартный (блокирующий), асинхронный и небезопасный.

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


### Асинхронный

Для аппаратной генерации случайных чисел процессор накапливает
электромагнитные шумы. Обычно они накоплены заранее, и получение
случайных чисел происходит быстро. Но могут быть ситуации, когда
системе требуется время на накопление энтропии.

При использовании синхронного API процесс заблокируется
во время накопления энтропии. Например, веб-сервер не сможет
обрабатывать запрос следующего посетителя, пока не сгенерирует
ID для предыдущего.

Но если использовать асинхронный API у Nano ID, то процесс будет работать
более эффективно: во время накопления шума сможет выполняться другая задача.

```js
import { nanoid } from 'nanoid/async'

async function createUser() {
  user.id = await nanoid()
}
```

Про ожидание накопления энтропии можно почитать в описании метода
`crypto.randomBytes` в [документации Node.js].

К сожалению, эта оптимизация имеет смысл только для Node.js. Web Crypto API
в браузерах не имеет асинхронной версии.

[документации node.js]: https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback


### Небезопасный

По умолчанию, Nano ID использует аппаратный генератор случайных чисел для
получения непредсказуемых ID и минимизации риска возникновения коллизий
(повторной генерации ранее выданных ID).
Но если вам не требуется устойчивость к подбору ID,
то вы можете перейти на небезопасный генератор.

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
import { customAlphabet } from 'nanoid/async'
const nanoid = customAlphabet('1234567890abcdef', 10)
async function createUser() {
  user.id = await nanoid()
}
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

У асинхронной и небезопасной версий нет `customRandom`.


## Руководство

### IE

Если вам нужна поддержка IE, потребуется включить [компиляцию `node_modules`]
с помощью Babel и вручную убрать вендорный префикс у `crypto`.

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

[компиляцию `node_modules`]: https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/


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

Подробнее об использовании свойства `key` читайте в
[официальной документации React](https://ru.reactjs.org/docs/lists-and-keys.html#keys).

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


### Rollup

Для Rollup понадобятся плагины [`@rollup/plugin-node-resolve`]
и [`@rollup/plugin-replace`].

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


### Mongoose

```js
const mySchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid()
  }
})
```


### Веб-воркеры

Веб-воркеры не имеют доступа к аппаратному генератору случайных чисел.

Аппаратный генератор нужен, в том числе, для непредсказуемости ID. Например,
когда доступ к секретному документу защищён ссылкой с уникальным ID.

Если вам не нужна непредсказуемость ID, то в Веб-воркере можно использовать
небезопасный генератор ID.

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
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

### Другие языки программирования

Nano ID был портирован на множество языков. Это полезно, чтобы сервер и клиент
генерировали ID по одной схеме.

- [C#](https://github.com/codeyu/nanoid-net)
- [C++](https://github.com/mcmikecreations/nanoid_cpp)
- [Clojure и ClojureScript](https://github.com/zelark/nano-id)
- [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
- [Crystal](https://github.com/mamantoha/nanoid.cr)
- [Dart и Flutter](https://github.com/pd4d10/nanoid-dart)
- [Deno](https://github.com/ianfabs/nanoid)
- [Go](https://github.com/matoous/go-nanoid)
- [Elixir](https://github.com/railsmechanic/nanoid)
- [Haskell](https://github.com/MichelBoucey/NanoID)
- [Janet](https://sr.ht/~statianzo/janet-nanoid/)
- [Java](https://github.com/aventrix/jnanoid)
- [Nim](https://github.com/icyphox/nanoid.nim)
- [Perl](https://github.com/tkzwtks/Nanoid-perl)
- [PHP](https://github.com/hidehalo/nanoid-php)
- [Python](https://github.com/puyuan/py-nanoid)
  со [словарями](https://pypi.org/project/nanoid-dictionary)
- [Ruby](https://github.com/radeno/nanoid.rb)
- [Rust](https://github.com/nikolay-govorov/nanoid)
- [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
- [V](https://github.com/invipal/nanoid)

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
