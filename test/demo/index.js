import shortid from 'shortid'
import { v4 as uuid4 } from 'uuid'
import rndm from 'rndm'
import uid from 'uid-safe'

import { nanoid, customAlphabet, random } from '../../'
import { nanoid as nonSecure } from '../../non-secure'

const COUNT = 50 * 1000
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const LENGTH = ALPHABET.length

let nanoid2 = customAlphabet(ALPHABET, LENGTH)

function print (number) {
  return String(Math.floor(number * 100))
    .replace(/\d{6}$/, ',$&')
    .replace(/\d{3}$/, ',$&')
}

function printDistr (title, fn) {
  let data = calcDistr(title, fn)
  let keys = Object.keys(data.chars)
  let length = keys.length
  let dots = ''

  let average = keys.reduce((all, l) => all + data.chars[l], 0) / length

  for (let l of keys.sort()) {
    let distribution = data.chars[l] / average
    dots += `<div class="dot" style="
      background: hsl(${ 200 * distribution }, 100%, 50%);
      width: ${ 100 / length }%;
    ">${ l }</div>`
  }

  document.body.innerHTML += `<section>
    <span>${ print(COUNT * 1000 / data.time) } ops/sec</span>
    <h2>${ data.title }</h2>
    ${ dots }
  </section>`
}

function calcDistr (title, fn) {
  let chars = { }

  let ids = []
  let j

  let start = Date.now()
  for (j = 0; j < COUNT; j++) ids.push(fn())
  let end = Date.now()

  for (j = 0; j < COUNT; j++) {
    let id = ids[j]
    if (title === 'uuid/v4') id = id.replace(/-./g, '')
    for (let char of id) {
      if (!chars[char]) chars[char] = 0
      chars[char] += 1
    }
  }

  return { title, chars, time: end - start }
}

let tasks = [
  () => printDistr('ideal', () => {
    let result = []
    for (let j = 0; j < LENGTH; j++) {
      result.push(ALPHABET[j])
    }
    return result
  }),
  () => printDistr('nanoid', () => nanoid()),
  () => printDistr('nanoid2', () => nanoid2()),
  () => printDistr('uid.sync', () => uid.sync(21)),
  () => printDistr('uuid/v4', () => uuid4()),
  () => printDistr('shortid', () => shortid()),
  () => printDistr('rndm', () => rndm()),
  () => printDistr('nanoid/non-secure', () => nonSecure()),
  () => printDistr('random % alphabet', () => {
    return [...random(LENGTH)].map(i => ALPHABET[i % ALPHABET.length])
  })
]

function run () {
  if (tasks.length === 0) return
  let task = tasks.shift()
  task()
  setTimeout(run, 10)
}

let html = ''
for (let i = 0; i < 10; i++) {
  html += `<div>${ nanoid() }</div>`
}
document.body.innerHTML = `<main>${ html }</main>`

run()
