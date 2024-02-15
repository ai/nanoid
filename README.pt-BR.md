# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Nano ID logo by Anton Lovchikov" width="180" height="94">

[English](./README.md) | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | [Bahasa Indonesia](./README.id-ID.md) | **Portuguese**

Um pequeno, seguro e amigável a URL, gerador de IDs únicos para JavaScript.

> "Um nível incrível de perfeccionismo sem sentido,
> que é simplesmente impossível não respeitar."

* **Pequeno.** 116 bytes (minificado e brotliado). Sem dependências.
  [Size Limit] controla o tamanho.
* **Seguro.** Usa gerador de números aleatórios de hardware. Pode ser usado em clusters.
* **IDs curtos.** Usa um alfabeto maior do que UUID (`A-Za-z0-9_-`).
  Então o tamanho do ID foi reduzido de 36 para 21 símbolos.
* **Portátil.** Nano ID foi portado para mais de [20 linguagens de programação](./README.pt-BR.md#outras-linguagem-de-programação).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Produzido em  <b><a href="https://evilmartians.com/devtools?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, consutoria de produtos para <b>ferramentas de desenvolvimento</b>.

---

[online tool]: https://gitpod.io/#https://github.com/ai/nanoid/
[with Babel]:  https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[Size Limit]:  https://github.com/ai/size-limit


## Tabela de Conteúdo

* [Comparação com UUID](#comparação-com-uuid)
* [Benchmark](#benchmark)
* [Segurança](#segurança)
* [instalação](#instalação)
* [API](#api)
  * [Bloqueio](#bloqueio)
  * [Não Seguro](#não-seguro)
  * [Alfabeto ou Tamanho Personalizado](#alfabeto-ou-tamanho-personalizado)
  * [Gerador de Bytes Aleatórios Personalizado](#gerador-de-bytes-aleatórios-personalizado)
* [Usabilidade](#usabilidade)
  * [React](#react)
  * [React Native](#react-native)
  * [PouchDB e CouchDB](#pouchdb-e-couchdb)
  * [Web Workers](#web-workers)
  * [CLI](#cli)
  * [Outras Linguagens de Programação](#outras-linguagem-de-programação)
* [Ferramentas](#ferramentas)


## Comparação com UUID

Nano ID é bastante comparável ao UUID v4 (baseado em aleatório).
Ele tem um número semelhante de bits aleatórios no ID
(126 no Nano ID e 122 no UUID), então tem uma probabilidade de colisão similar:


> Para haver uma chance de um em um bilhão de duplicação,
> 103 trilhões de IDs da versão 4 devem ser gerados.

Há duas diferenças principais entre Nano ID e UUID v4:


1. Nano ID usa um alfabeto maior, então um número semelhante de bits aleatórios
   é compactado em apenas 21 símbolos em vez de 36.
2. O código do Nano ID é **4 vezes menor** do que o pacote `uuid/v4`:
    130 bytes em vez de 423.


## Benchmark

```rust
$ node ./test/benchmark.js
crypto.randomUUID         21,119,429 ops/sec
uuid v4                   20,368,447 ops/sec
@napi-rs/uuid             11,493,890 ops/sec
uid/secure                 8,409,962 ops/sec
@lukeed/uuid               6,871,405 ops/sec
nanoid                     5,652,148 ops/sec
customAlphabet             3,565,656 ops/sec
secure-random-string         394,201 ops/sec
uid-safe.sync                393,176 ops/sec
shortid                       49,916 ops/sec

Non-secure:
uid                       58,860,241 ops/sec
nanoid/non-secure          2,744,615 ops/sec
rndm                       2,718,063 ops/sec
```

Configuração de teste: ThinkPad X1 Carbon Gen 9, Fedora 36, Node.js 18.9.


## Segurança


*Veja um bom artigo sobre a teoria dos geradores aleatórios:
[Secure random values (in Node.js)] (em inglês)*



* **Imprevisibilidade.** Em vez de usar o inseguro `Math.random()`, o Nano ID
  usa o módulo `crypto` no Node.js e a API Web Crypto nos navegadores.
  Esses módulos usam um gerador de números aleatórios de hardware imprevisível.
* **Uniformidade.** `random % alphabet` é um erro comum ao codificar
  um gerador de ID. A distribuição não será uniforme; haverá uma chance menor
  de alguns símbolos aparecerem em comparação com outros. Então, reduzirá
  o número de tentativas ao forçar a entrada. O Nano ID usa um [algoritmo melhor]
  e é testado quanto à uniformidade.

  <img src="img/distribution.png" alt="Nano ID uniformity"
     width="340" height="135">


* **Bem documentado:** todos os hacks do Nano ID são documentados. Veja os comentários
  em [a fonte].
* **Vulnerabilidades:** para relatar uma vulnerabilidade de segurança, use
  o [contato de segurança do Tidelift](https://tidelift.com/security).
  O Tidelift coordenará a correção e a divulgação.

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[algoritmo melhor]:                  https://github.com/ai/nanoid/blob/main/index.js
[a fonte]:                           https://github.com/ai/nanoid/blob/main/index.js


## Instalação

```bash
npm install nanoid
```

Nano ID 5 só funciona com projetos ESM, em testes ou scripts Node.js.
Para CommonJS, você precisa do Nano ID 3.x (ainda o suportamos):

```bash
npm install nanoid@3
```

Para hacks rápidos, você pode carregar o Nano ID a partir do CDN. No entanto, não é recomendado
ser usado em produção devido ao baixo desempenho de carregamento.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


## API

Nano ID tem 2 APIs: normal e não segura.

Por padrão, o Nano ID usa símbolos amigáveis a URL (`A-Za-z0-9_-`) e retorna um ID
com 21 caracteres (para ter uma probabilidade de colisão similar ao UUID v4).


### Bloqueio

O maneira mais segura e fácil de usar o Nano ID.

Em casos raros, pode bloquear a CPU de outro trabalho durante a coleta de ruído
para o gerador de números aleatórios de hardware.

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Se você quiser reduzir o tamanho do ID (e aumentar a probabilidade de colisões),
você pode passar o tamanho como argumento.

```js
nanoid(10) //=> "IRFa-VaY2b"
```

Não se esqueça de verificar a segurança do tamanho do seu ID
em nosso calculador de [probabilidade de colisão de ID].

Você também pode usar um [alfabeto personalizado](#alfabeto-ou-tamanho-personalizado)
ou um [gerador aleatório](#gerador-de-bytes-aleatórios-personalizado).

[probabilidade de colisão de ID]: https://zelark.github.io/nano-id-cc/


### Não-Seguro

Por padrão, o Nano ID usa geração de bytes aleatórios de hardware para segurança
e baixa probabilidade de colisão. Se você não está tão preocupado com a segurança,
você pode usá-lo para ambientes sem geradores de números aleatórios de hardware.


```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### Alfabeto ou Tamanho Personalizado

`customAlphabet` retorna uma função que permite criar `nanoid`
com seu próprio alfabeto e tamanho de ID.

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

Verifique a segurança do seu alfabeto personalizado e tamanho do ID em nosso
calculador de [probabilidade de colisão de ID]. Para mais alfabetos, confira
as opções em [`nanoid-dictionary`].

O alfabeto deve conter 256 símbolos ou menos.
Caso contrário, a segurança do algoritmo gerador interno não é garantida.

Além de definir um tamanho padrão, você pode alterar o tamanho do ID ao chamar
a função:

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid(5) //=> "f01a2"
```

[probabilidade de colisão de ID]: https://alex7kom.github.io/nano-nanoid-cc/
[`nanoid-dictionary`]:      https://github.com/CyberAP/nanoid-dictionary


### Gerador de Bytes Aleatórios Personalizado

`customRandom` permite criar um `nanoid` e substituir o alfabeto
e o gerador de bytes aleatórios padrão.

No exemplo a seguir, um gerador baseado em semente é usado:

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return (new Uint8Array(size)).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

A chamada de retorno `random` deve aceitar o tamanho do array e retornar um array
com números aleatórios.

Se você quiser usar os mesmos símbolos amigáveis a URL com `customRandom`,
você pode obter o alfabeto padrão usando o `urlAlphabet`.

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

Observe que, entre as versões do Nano ID, podemos alterar a sequência de chamadas do gerador
aleatório. Se você estiver usando geradores baseados em semente, não garantimos
o mesmo resultado.


## Usabilidade

### React

Não há uma maneira correta de usar o Nano ID para a prop `key` do React
pois ela deve ser consistente entre as renderizações.

```jsx
function Todos({todos}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={nanoid()}> /* NÃO FAÇA ISSO */
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

Em vez disso, você deve tentar alcançar um ID estável dentro do item da lista.

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
)
```

Em caso de IDs não estáveis, você prefere usar o índice como `key`
em vez de `nanoid()`:


```jsx
const todoItems = todos.map((text, index) =>
  <li key={index}> /* Ainda não é recomendado, mas é preferível em relação ao nanoid().
                      Faça isso apenas se os itens não tiverem IDs estáveis. */
    {text}
  </li>
)
```

Caso você precise apenas de IDs aleatórios para vincular elementos como rótulos
e campos de entrada, o [`useId`] é recomendado.
Esse hook foi adicionado no React 18.

[`useId`]: https://reactjs.org/docs/hooks-reference.html#useid


### React Native


React Native não tem um gerador aleatório integrado. O seguinte polyfill
funciona para React Native puro e Expo a partir da versão `39.x`.

1. Verifique a documentação de [`react-native-get-random-values`] e instale ele.
2. Importe ele antes do Nano ID.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

[`react-native-get-random-values`]: https://github.com/LinusU/react-native-get-random-values


### PouchDB e CouchDB

No PouchDB e CouchDB, os IDs não podem começar com um sublinhado `_`.
Um prefixo é necessário para evitar esse problema, pois o Nano ID pode usar um `_`
no início do ID por padrão.


Substitua o ID padrão com a seguinte opção:

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### Web Workers

Web Workers não têm acesso a um gerador aleatório seguro.


Segurança é importante em IDs quando os IDs devem ser imprevisíveis.
Por exemplo, na geração de links "acessar por URL".
Se você não precisa de IDs imprevisíveis, mas precisa usar Web Workers,
você pode usar o gerador de ID não seguro.

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

Nota: IDs não-seguros são mais propensos a ataques de colisão.


### CLI


Você pode obter um ID único no terminal chamando `npx nanoid`. Você só precisa
Node.js no sistema. Você não precisa que o Nano ID esteja instalado em nenhum lugar.

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

O tamanho do ID gerado pode ser especificado com a opção `--size` (ou `-s`):

```sh
$ npx nanoid --size 10
L3til0JS4z
```

Alfabeto personalizado pode ser especificado com a opção `--alphabet` (ou `-a`)
(neste caso, `--size` é necessário):


```sh
$ npx nanoid --alphabet abc --size 15
bccbcabaabaccab
```


### Outras Linguagem de Programação

o Nano ID foi adaptado para muitas linguagens. Você pode usar esses adaptadores para ter
o mesmo gerador de ID no lado do cliente e do servidor.

* [C#](https://github.com/codeyu/nanoid-net)
* [C++](https://github.com/mcmikecreations/nanoid_cpp)
* [Clojure e ClojureScript](https://github.com/zelark/nano-id)
* [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
* [Crystal](https://github.com/mamantoha/nanoid.cr)
* [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
* [Deno](https://github.com/ianfabs/nanoid)
* [Elixir](https://github.com/railsmechanic/nanoid)
* [Go](https://github.com/matoous/go-nanoid)
* [Haskell](https://github.com/MichelBoucey/NanoID)
* [Haxe](https://github.com/flashultra/uuid)
* [Janet](https://sr.ht/~statianzo/janet-nanoid/)
* [Java](https://github.com/aventrix/jnanoid)
* [Kotlin](https://github.com/viascom/nanoid-kotlin)
* [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
* [Nim](https://github.com/icyphox/nanoid.nim)
* [OCaml](https://github.com/routineco/ocaml-nanoid)
* [Perl](https://github.com/tkzwtks/Nanoid-perl)
* [PHP](https://github.com/hidehalo/nanoid-php)
* [Python](https://github.com/puyuan/py-nanoid) com [dicionário](https://pypi.org/project/nanoid-dictionary)
* [Extensão](https://github.com/spa5k/uids-postgres) Postgres e [Função Nativa](https://github.com/viascom/nanoid-postgres)
* [R](https://github.com/hrbrmstr/nanoid) (com dicionario)
* [Ruby](https://github.com/radeno/nanoid.rb)
* [Rust](https://github.com/nikolay-govorov/nanoid)
* [Swift](https://github.com/antiflasher/NanoID)
* [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
* [V](https://github.com/invipal/nanoid)
* [Zig](https://github.com/SasLuca/zig-nanoid)

Para outros ambientes, [CLI] está disponível para gerar IDs a partir de uma linha de comando.

[CLI]: #cli


## Ferramentas

* [ID size calculator] mostra a probabilidade de colisão ao ajustar
  o alfabeto ou o tamanho do ID.
* [`nanoid-dictionary`] com alfabetos populares para usar com [`customAlphabet`].
* [`nanoid-good`] para ter certeza de que seu ID não contém palavras obscenas.


[`nanoid-dictionary`]: https://github.com/CyberAP/nanoid-dictionary
[ID size calculator]:  https://zelark.github.io/nano-id-cc/
[`customAlphabet`]:    #custom-alphabet-or-size
[`nanoid-good`]:       https://github.com/y-gagar1n/nanoid-good
