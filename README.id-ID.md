# Nano ID

<img src="https://ai.github.io/nanoid/logo.svg" align="right"
     alt="Logo Nano ID oleh Anton Lovchikov" width="180" height="94">

[English](./README.md) | [Русский](./README.ru.md) | [简体中文](./README.zh-CN.md) | **Bahasa Indonesia**

Sebuah generator ID yang unik dalam bentuk string yang ringan, aman, serta _URL-friendly_ untuk JavaScript.

> "Sebuah tingkat kesempurnaan yang luar biasa,
> yang mana tidak mungkin untuk tidak dihormati."

- **Ringan.** Hanya 130 bytes (diperkecil dan gzipped). Tidak ada ketergantungan (dependencies) apapun. [Size Limit](https://github.com/ai/size-limit) mengatur ukuran dari generator ini.
- **Aman.** Nano ID menggunakan RNG yang terdapat pada perangkat keras. Dapat digunakan dalam lingkungan seperti klaster.
- **ID yang pendek.** Nano ID menggunakan alfabet yang lebih banyak ketimbang UUID (`A-Za-z0-9_-`), karenanya ukuran ID menjadi berkurang dari 36 menjadi 21 simbol.
- **Portabel.** Nano ID telah dimigrasi untuk [20 bahasa pemrograman lainnya](#bahasa-pemrograman-lainnya).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Mendukung penjelajah (browser) modern, IE [dengan Babel](https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/), Node.js, dan React Native.

<a href="https://evilmartians.com/?utm_source=nanoid"
  alt="Tautan untuk menuju situs milik sponsor">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Disponsori oleh Evil Martians" width="236" height="54">
</a>


## Table of Contents

- [Perbandingan dengan UUID](#perbandingan-dengan-uuid)
- [Benchmark](#benchmark)
- [Keamanan](#keamanan)
- [Instalasi](#instalasi)
- [API](#api)
  - [Blocking](#blocking)
  - [Non-Secure](#non-secure)
  - [Alfabet dan Ukuran (Custom)](#alfabet-dan-ukuran-penyesuaian)
  - [Generasi Random Bytes (Custom)](#generasi-random-bytes-custom)
- [Penggunaan](#penggunaan)
  - [React](#react)
  - [React Native](#react-native)
  - [PouchDB dan CouchDB](#pouchdb-dan-couchdb)
  - [Web Workers](#web-workers)
  - [CLI](#cli)
  - [Bahasa Pemrograman Lainnya](#bahasa-pemrograman-lainnya)
- [Alat](#alat)


## Perbandingan dengan UUID

Nano ID dapat dibandingkan dengan UUID v4 (yang berbasis acak / _randomly generated_). Nano ID dan UUID v4 memiliki jumlah bita yang mirip pada ID yang dihasilkan (126 bita pada NanoID dan 122 bita pada UUID), karenanya ia memiliki probabilitas _collision_ (konflik / tabrakan) yang hampir serupa:

> Agar timbul kemungkinan collison / duplikasi ID satu dalam satu miliar, perlu dihasilkan 103 triliun UUID v4.

Ada dua buah perbedaan antara Nano ID dan UUID v4:

1. Nano ID menggunakan alfabet yang lebih lebar, karenanya jumlah bita acak dapat 'dikemas' dalam 21 simbol, bukan 36 simbol.
2. Kode sumber Nano ID **empat kali lebih kecil** ketimbang `uuid/v4`: 130 bytes dibanding 423 bytes.


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

Konfigurasi pengujian: ThinkPad X1 Carbon Gen 9, Fedora 36, Node.js 18.9.


## Keamanan

_Lihat artikel yang informatif tentang teori angka acak: [Nilai acak yang aman dalam Node.js (English)](https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba)_.

- **Ketidakpastian.** Sebagai ganti untuk penggunaan `Math.random()`, Nano ID menggunakan modul `crypto` yang ada di dalam Nodejs dan/atau Web Crypto API dalam penjelajah (_browser_). Modul-modul ini menggunakan generator acak berbasis perangkat keras yang tidak bisa diprediksi untuk mendapatkan nilai-nilai yang tidak pasti yang aman secara kriptografis.

- **Keseragaman.** Pembagian dengan rumus `random % alphabet` adalah kesalahan yang seringkali dilakukan ketika merancang sebuah generator ID. Distribusi dari nilai-nilai tersebut tidak akan seimbang; dalam artian ada kesempatan untuk beberapa simbol untuk muncul dibandingkan dengan simbol yang lain. Ini memiliki dampak yang kurang baik, yakni mengurangi jumlah percobaan ketika seseorang mencoba untuk melakukan _brute-force attacks_. Nano ID menggunakan [algoritma yang lebih baik](https://github.com/ai/nanoid/blob/main/index.js) dan sudah diuji untuk keseragamannya.

  <img src="img/distribution.png" alt="Nano ID uniformity"
    width="340" height="135">

- **Terdokumentasi secara baik.** Seluruh algoritma Nano ID sudah terdokumentasi. Lihat komentar di [kode sumber](https://github.com/ai/nanoid/blob/main/index.js).

- **Kerentanan.** Untuk melaporkan sebuah _security vulnerability_ atau kerentanan, mohon menggunakan [Tidelift Security Contact](https://tidelift.com/security). Tidelift akan mengkoordinasikan pembetulan dan penyingkapan dari kerentanan tersebut.


## Instalasi

```bash
npm install --save nanoid
```

Nano ID 4 hanya tersedia untuk proyek, pengujian, atau skrip ESM Node.js.
Untuk CommonJS Anda memerlukan Nano ID 3.x (kami masih mendukungnya):

```bash
npm install --save nanoid@3
```

Apabila ingin 'coba-coba' terlebih dahulu, dapat digunakan Nano ID melalui CDN. Hal ini tidak direkomendasikan untuk digunakan pada lingkungan produksi karena performa pemuatan (_loading_) yang berkurang.

```js
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
```


## API

Nano ID memiliki dua API: normal dan _non-secure_.

Bawaannya, Nano ID menggunakan simbol yang _URL-friendly_ (`A-Za-z0-9_-`) dan mengembalikan ID dengan 21 karakter (untuk memiliki probabilitas collision / tabrakan yang mirip dengan UUID v4).


### Blocking

Penggunaan Nano ID yang aman dan yang paling mudah.

Dalam kasus langka, fungsi ini dapat menghambat CPU untuk melakukan proses yang lain ketika dalam proses 'noise-collection' untuk generasi nilai acak (yang dilakukan pada perangkat keras).

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
```

Apabila ingin mengurangi ukuran ID (dan meningkatkan probabilitas collision), dapat dimasukkan `size` sebagai argumen dari fungsi `nanoid()`.

```js
nanoid(10) //=> "IRFa-VaY2b"
```

Jangan lupa memeriksa tingkat keamanan dari ukuran ID dalam situs [ID collision probability calculator](https://zelark.github.io/nano-id-cc/).

Dapat digunakan pula [custom alphabet](#custom-alphabet-or-size) atau [random generator](#custom-random-bytes-generator) yang lain.


### Non-Secure

Konfigurasi bawaan Nano ID menggunakan random bytes generator yang berasal dari perangkat keras untuk keamanan dan probabilitas collision yang rendah. Apabila tidak terlalu memikirkan soal keamanan, dapat pula menggunakan non-secure generator yang lebih cepat.

```js
import { nanoid } from 'nanoid/non-secure'
const id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```


### Alfabet dan Ukuran (Custom)

`customAlphabet` digunakan untuk membuat Nano ID dengan alfabet dan ukuran ID yang sesuai dengan kebutuhan (dapat dikustomisasi).

```js
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)
model.id = nanoid() //=> "4f90d13a42"
```

Ketika menggunakan fungsi ini, jangan lupa untuk memeriksa keamanan alfabet dan ukuran ID dalam [ID collision probability calculator](https://alex7kom.github.io/nano-nanoid-cc/). Untuk lebih banyak alfabet, dapat menggunakan [`nanoid-dictionary`](https://github.com/CyberAP/nanoid-dictionary).

Alfabet harus terbentuk dari 256 simbol atau lebih kecil. Selain itu, keamanan algoritma generasi yang berada di dalam library ini tidak dijamin aman.

API non-secure yang dapat dikustomisasi dengan `customAlphabet` pun tersedia disini:

```js
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdef', 10)
user.id = nanoid()
```


### Generasi Random Bytes (Custom)

`customRandom` digunakan untuk membuat Nano ID yang mengganti alfabet dan algoritma _random bytes generator_ yang telah diimplementasikan pada versi bawaan (dalam artian menggunakan algoritma sendiri untuk mendapatkan random bytes).

Pada contoh berikut, digunakan _seed-based generator_:

```js
import { customRandom } from 'nanoid'

const rng = seedrandom(seed)
const nanoid = customRandom('abcdef', 10, size => {
  return new Uint8Array(size).map(() => 256 * rng())
})

nanoid() //=> "fbaefaadeb"
```

Fungsi _callback_ pada `random` harus menerima ukuran array dan mengembalikan sebuah array dengan angka acak.

Apabila ingin menggunakan alfabet bawaan NanoID pada fungsi `customRandom`, dapat menggunakan konstanta `urlAlphabet` seperti berikut:

```js
const { customRandom, urlAlphabet } = require('nanoid')
const nanoid = customRandom(urlAlphabet, 10, random)
```

API asinkronus dan non-secure tidak tersedia untuk fungsi `customRandom`.


## Penggunaan

### React

Dalam React, tidak ada cara yang benar bila ingin menggunakan Nano ID untuk prop `key`, karena `key` tersebut harus konsisten dalam setiap proses render yang terjadi.

```jsx
function Todos({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        /* JANGAN DILAKUKAN! */
        <li key={nanoid()}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

Karena hal tersebut, disarankan untuk menggunakan ID yang stabil pada setiap objek yang di-render oleh React.

```jsx
const todoItems = todos.map(todo => <li key={todo.id}>{todo.text}</li>)
```

Apabila tidak memiliki ID yang stabil pada setiap _item_ yang di-render pada React, lebih baik menggunakan indeks sebuah array sebagai `key` ketimbang menggunakan fungsi `nanoid()`, seperti berikut:

```jsx
const todoItems = todos.map((text, index) => (
  /* Tetap tidak direkomendasikan, tetapi lebih disarankan dari 'nanoid()'. Lakukan ini
    apabila setiap objek / item dalam list tidak ada ID yang stabil. */
  <li key={index}>{text}</li>
))
```

### React Native

React Native tidak memiliki _built-in random generator_. Digunakan polyfill seperti berikut yang berjalan untuk React Native dan Expo yang bermula dari versi `39.x`.

1. Periksa dokumentasi [`react-native-get-random-values`](https://github.com/LinusU/react-native-get-random-values) dan install di aplikasi.
2. Import library tersebut sebelum Nano ID.

```js
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
```

### PouchDB dan CouchDB

Dalam PouchDB dan CouchDB, ID tidak bisa dimulai dengan underscore `_`. Sebuah _prefix_ dibutuhkan untuk mencegah hal ini terjadi, karena Nano ID mungkin menggunakan `_` sebagai karakter pertama dari ID yang dihasilkan.

ID bawaan dapat diubah dengan opsi berikut:

```js
db.put({
  _id: 'id' + nanoid(),
  …
})
```


### Web Workers

Web Workers tidak memiliki akses untuk secure random generator.

Keamanan sangat penting pada ID yang mana setiap ID harus memiliki sifat tidak bisa diprediksi, seperti pada contoh use-case generasi link pada "access by URL". Apabila tidak memerlukan ID yang tidak bisa diprediksi, tetapi ingin/harus menggunakan Web Workers, dapat digunakan NanoID dengan API non-secure.

```js
import { nanoid } from 'nanoid/non-secure'
nanoid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

Perhatian: ID yang dihasilkan dari non-secure dapat lebih mudah tabrakan / memiliki probabilitas collision yang lebih besar.


### CLI

Nano ID dapat didapatkan dengan cara menggunakan `npx nanoid` pada Terminal. Hanya diperlukan Node.js untuk ini, dan tidak perlu mengunduh dan menginstall Nano ID dalam sistem.

```sh
$ npx nanoid
npx: installed 1 in 0.63s
LZfXLFzPPR4NNrgjlWDxn
```

Bila ingin mengganti alfabet atau ukuran ID, dapat menggunakan [`nanoid-cli`](https://github.com/twhitbeck/nanoid-cli).


### Bahasa Pemrograman Lainnya

Nano ID telah bermigrasi ke berbagai macam bahasa. Seluruh versi dapat digunakan untuk mendapatkan ID generator yang sama pada sisi klien dan sisi penyedia layanan (_client-side_ dan _server-side_).

- [C#](https://github.com/codeyu/nanoid-net)
- [C++](https://github.com/mcmikecreations/nanoid_cpp)
- [Clojure and ClojureScript](https://github.com/zelark/nano-id)
- [ColdFusion/CFML](https://github.com/JamoCA/cfml-nanoid)
- [Crystal](https://github.com/mamantoha/nanoid.cr)
- [Dart & Flutter](https://github.com/pd4d10/nanoid-dart)
- [Deno](https://github.com/ianfabs/nanoid)
- [Elixir](https://github.com/railsmechanic/nanoid)
- [Go](https://github.com/jaevor/go-nanoid)
- [Haskell](https://github.com/MichelBoucey/NanoID)
- [Haxe](https://github.com/flashultra/uuid)
- [Janet](https://sr.ht/~statianzo/janet-nanoid/)
- [Java](https://github.com/aventrix/jnanoid)
- [MySQL/MariaDB](https://github.com/viascom/nanoid-mysql-mariadb)
- [Nim](https://github.com/icyphox/nanoid.nim)
- [OCaml](https://github.com/routineco/ocaml-nanoid)
- [Perl](https://github.com/tkzwtks/Nanoid-perl)
- [PHP](https://github.com/hidehalo/nanoid-php)
- [Python](https://github.com/puyuan/py-nanoid) with [dictionaries](https://pypi.org/project/nanoid-dictionary)
- [Postgres Extension](https://github.com/spa5k/uids-postgres)
- [Postgres Native Function](https://github.com/viascom/nanoid-postgres)
- [R](https://github.com/hrbrmstr/nanoid) (with dictionaries)
- [Ruby](https://github.com/radeno/nanoid.rb)
- [Rust](https://github.com/nikolay-govorov/nanoid)
- [Swift](https://github.com/antiflasher/NanoID)
- [Unison](https://share.unison-lang.org/latest/namespaces/hojberg/nanoid)
- [V](https://github.com/invipal/nanoid)
- [Zig](https://github.com/SasLuca/zig-nanoid)

Untuk environment lainnya, [CLI](#cli) tersedia untuk melakukan generasi ID dari command line / Terminal.


## Alat

- [ID Size Calculator](https://zelark.github.io/nano-id-cc/) menunjukkan probabilitas collision ketika melakukan konfigurasi alfabet dan ukuran.
- [`nanoid-dictionary`](https://github.com/CyberAP/nanoid-dictionary) untuk menggunakan alfabet popular dalam fungsi [`customAlphabet`](#custom-alphabet-or-size)
- [`nanoid-good`](https://github.com/y-gagar1n/nanoid-good) untuk meyakinkan bahwa ID yang di-generasi tidak memiliki kata-kata yang kurang baik (kasar, tidak sopan, dsb.).
