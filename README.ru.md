# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Логотип Nano ID от Антона Ловчикова" width="180" height="94">

[English](./README.md) | **Русский** | [简体中文](./README.zh-CN.md)

Генератор уникальных ID для JavaScript — маленький, безопасный,
совместимый с URL.

> «Поразительный уровень бессмысленного перфекционизма,
> который просто невозможно не уважать»

* **Маленький.** 108 байт (после минификации и gzip). Без зависимостей.
  [Size Limit] следит за размером.
* **Быстрый.** На 60 % быстрее UUID.
* **Безопасный.** Использует аппаратный генератор случайности.
  Можно использовать в кластерах машин.
* **Короткие ID.** Алфавит в ID больше, чем у UUID (`A-Za-z0-9_-`).
  Поэтому длина ID уменьшена с 36 до 21 символа.
* **Работает везде.** Nano ID уже портировали
  на [19 языков](#другие-язык-программирования).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Поддерживает современные браузеры, IE ([с Babel]), Node.js и React Native.

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[с Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Пр поддержке Злых марсиан" width="236" height="54">
</a>

## Оглавление

* [Сравнение с UUID](#сравнение-с-uuid)
* [Сравнение производительности](#сравнение-производительности)
* [Инструменты](#инструменты)
* [Безопасность](#безопасность)
* [Руководство](#руководство)
  * [JS](#js)
  * [IE](#ie)
  * [React](#react)
  * [React Native](#react-native)
  * [Rollup](#rollup)
  * [PouchDB и CouchDB](#pouchdb-и-couchdb)
  * [Mongoose](#mongoose)
  * [ES-модули](#es-модули)
  * [Веб-воркер](#веб-воркер)
  * [Терминал](#терминал)
  * [Другие язык программирования](#другие-язык-программирования)
* [API](#api)
  * [Асинхронный](#асинхронный)
  * [Небезопасный](#небезопасный)
  * [Смена алфавита или длины](#смена-алфавита-или-длины)
  * [Смена генератора случайности](#смена-генератора-случайности)


## Сравнение с UUID

Nano ID похож на UUID v4 (случайный).
У них столько же бит случайности в ID (126 у Nano ID против 122 у UUID),
поэтому у них сравнимая вероятность повторно сгенерировать уже выданный ID:

> Чтобы вероятность повтора приблизилась к 1 на миллиард,
> нужно сгенерировать 103 триллиона ID.

Но между ними есть 3 важных отличия:

1. Nano ID использует более широкий алфавит и сравнимое количество
   бит случайности будут упакованы в строку в 21 символ, против 36 у UUID.
2. Код Nano ID **в 4.5 раз меньше**, чем у `uuid/v4` — 108 байт против 483.
3. Из-за оптимизаций с выделением памяти, Nano ID **на 60% быстрее** UUID.


## Сравнение производительности

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

Среда сравнения: ThinkPad X1 Carbon Gen 9, Fedora 34, Node.js 16.9.


## Инструменты

* [Калькулятор длины ID] поможет подобрать оптимальную длину ID,
  в зависимости от частоты выдачи ID и нужной надёжности системы.
* [`nanoid-dictionary`] с популярными алфавитами для [`customAlphabet`].
* [`nanoid-good`] гарантирует, что в случайном ID не будет матерных слов.

[Калькулятор длины ID]: https://zelark.github.io/nano-id-cc/
[`nanoid-dictionary`]:  https://github.com/CyberAP/nanoid-dictionary
[`customAlphabet`]:     #смена-алфавита-или-длины
[`nanoid-good`]:        https://github.com/y-gagar1n/nanoid-good


## Безопасность

*См. также хорошую статью о теориях генераторов случайности:
[Secure random values (in Node.js)]*

* **Непредсказуемость.** Вместо предсказуемого `Math.random()`, Nano ID
  использует модуль `crypto` в Node.js и Web Crypto API в браузере.
  Эти модули дают доступ к аппаратному источнику случайности.
* **Равномерность.** Например, есть популярная ошибка `random % alphabet`,
  которую часто допускают при разработке генератора ID.
  Распределение вероятности для каждого символа может не быть одинаковым.
  Из-за неравномерности использования пространства алфавита, на перебор ID
  нужно будет меньше времени, чем ожидается. Nano ID использует
  [более совершенный алгоритм] и тестирует равномерность символов.

  <img src="img/distribution.png" alt="Распределение Nano ID"
     width="340" height="135">

* **Документация:** все хитрости Nano ID хорошо документированы — смотрите
  комментарии [в исходниках].
* **Уязвимости:** если вы нашли уязвимость в Nano ID, свяжитесь с
  [командой безопасности Tidelift](https://tidelift.com/security).
  Они проконтролирует исправление и проинформируют пользователей.

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[более совершенный алгоритм]:        https://github.com/ai/nanoid/blob/main/index.js
[в исходниках]:                      https://github.com/ai/nanoid/blob/main/index.js


## Руководство

### JS

Основная функция использует символы, безопасные для URL (`A-Za-z0-9_-`).
Она возвращает ID длиной 21 символ (чтобы вероятность повторной выдачи такого
же ID была соизмеримой с UUID v4).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Для Node.js поддерживается CommonJS-импорт:

```js
const { nanoid } = require('nanoid')
```

Если вы хотите уменьшить длину ID (но повысить вероятность повторной выдачи ID),
передайте длину ID, как аргумент функции.

```js
nanoid(10) //=> "IRFa-VaY2b"
```

При изменении размера, всегда проверяйте риски
в нашем [калькуляторе коллизий](https://zelark.github.io/nano-id-cc/).

Вы также можете [сменить алфавит ID](#смена-алфавита-или-длины) или
[генератор случайности](#смена-генератора-случайности).


### IE

Если вам нужна поддержка IE, вы должны включить [компиляцию `node_modules`]
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
function Todos({todos}) {
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

Попробуйте найти стабильный ID в данных вашего списка.

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

Если ничего стабильного в списке нет, используйте хотя бы индекс массива.

```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* Не самый лучший способ. Но лучше nanoid().
                      Используйте только если в списке нет стабильных ID. */
    {text}
  </li>
)
```

Если вы используете Nano ID для HTML-свойства `id`, то нужно в начало написать
какую-то строку — HTML ID не может начинаться с цифры, но Nano ID иногда может
сгенерировать такие ID.

```jsx
<input id={'id' + this.id} type="text"/>
```


### React Native

React Native не имеет встроенного аппаратного генератора случайности.
Полифил ниже работает в чистом React Native и в Expo начиная с версии 39.

1. Прочитайте документацию [`react-native-get-random-values`] и установите его.
2. Импортируйте эту библиотеку до импорта Nano ID.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### Rollup

Для Rollup вам нужны плагины [`@rollup/plugin-node-resolve`]
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

В PouchDB и CouchDB, ID не могут начинаться на `_`. Добавьте к ID префикс,
так как иногда Nano ID может сгенерировать ID с `_` вначале.

Изменить стандартный ID можно через эту опцию:

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


### ES-модули

Nano ID сразу идёт с ES-модулями. Вам не надо ничего делать, чтобы ES-импорты
работали в webpack, Rollup, Parcel, или Node.js.

```js
import { nanoid } from 'nanoid'
```

Для быстрого прототипирования вы можете взять Nano ID с CDN. Специальный
минифицированный файл `nanoid.js` есть на jsDelivr.

Но не используйте этот метод на реальном сайте, так как он сильно бьёт
по скорости загрузки сайта.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


### Веб-воркер

Веб-воркер не имеет доступа к аппаратному генератору случайности.

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

Для смены алфавита или длины ID есть отдельный проект [`nanoid-cli`].

[`nanoid-cli`]: https://github.com/twhitbeck/nanoid-cli


### Другие языки программирования

Nano ID был портирован на множество языков. Это полезно, чтобы сервер и клиент
генерировали ID по одной схеме.

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure и ClojureScript](https://github.com/zelark/nano-id)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart и Flutter](https://github.com/pd4d10/nanoid-dart)
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
  со [словарями](https://pypi.org/project/nanoid-dictionary)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [V](https://github.com/invipal/nanoid)

Для остальных сред можно использовать Nano ID [для терминала].

[для терминала]: #терминал


## API

### Асинхронный

Для аппаратной генерации случайности, процессор накапливает
электромагнитные шумы. При синхронном API, процессор будет простаивать
во время этого накопления.

Но если использовать асинхронный API у Nano ID, то процессор будет
использоваться более эффективно — во время накопления шума, другая задача
может выполняться.

```js
import { nanoid } from 'nanoid/async'

async function createUser () {
  user.id = await nanoid()
}
```

К сожалению, эта оптимизация имеет смысл только для Node.js. Web Crypto API
в браузерах не имеет асинхронной версии.


### Небезопасный

По умолчанию, Nano ID использует аппаратный генератор случайности для
непредсказуемости ID и минимизации рисков случайного повтора ID. Но если вам
не нужна непредсказуемость, то вы можете сильно ускорить генерацию ID,
перейдя на небезопасный генератор.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

Но учтите, что предсказуемость ID может быть использована атакующим,
чтобы сломать систему.


### Смена алфавита или длины

Функция `customAlphabet` позволяет создать свою функцию `nanoid`
с нужным вам алфавитом и длиной ID.

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid() //=> "4f90d13a42"
```

Не забудьте проверить риски коллизии вашего алфавита и длины
[на нашем калькуляторе]. [`nanoid-dictionary`] содержит много популярных
примеров альтернативных алфавитов.

Алфавит должен содержать ≤256 символов. Иначе мы не сможем гарантировать
непредсказуемость ID.

Так же можно заменить алфавит у небезопасной и асинхронной версии.

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

[на нашем калькуляторе]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-dictionary`]:    https://github.com/CyberAP/nanoid-dictionary


### Смена генератора случайности

Функция `customRandom` позволяет создать свою функцию `nanoid` со своими
генераторами случайности, алфавитом и длинной ID.

Например, можно использовать генератор c seed для повторяемости тестов.

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

Функция в третьем аргументе `customRandom` должна принимать длину массива
и возвращать нужный массив со случайными числами

Если вы хотите заменить только генератор случайности, но оставить
URL-совместимый алфавит, то стандартный алфавит доступен
в экспорте `urlAlphabet`.

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

У асинхронной и небезопасной версий нет `customRandom`.
