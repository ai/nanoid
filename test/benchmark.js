#!/usr/bin/env node

let { uid: uidSecure } = require('uid/secure')
let { v4: lukeed4 } = require('@lukeed/uuid')
let { v4: uuid4 } = require('uuid')
let benchmark = require('benchmark')
let shortid = require('shortid')
let uidSafe = require('uid-safe')
let { uid } = require('uid')
let crypto = require('crypto')
let pico = require('picocolors')
let cuid = require('cuid')
let rndm = require('rndm')
let srs = require('secure-random-string')

let { nanoid: aNanoid, customAlphabet: aCustomAlphabet } = require('../async')
let { nanoid, customAlphabet } = require('../')
let { nanoid: nonSecure } = require('../non-secure')

let suite = new benchmark.Suite()

let nanoid2 = customAlphabet('1234567890abcdef-', 10)
let asyncNanoid2 = aCustomAlphabet('1234567890abcdef-', 10)

function formatNumber(number) {
  return String(number)
    .replace(/\d{3}$/, ',$&')
    .replace(/^(\d|\d\d)(\d{3},)/, '$1,$2')
}

suite
  .add('crypto.randomUUID', () => {
    crypto.randomUUID()
  })
  .add('uid/secure', () => {
    uidSecure(32)
  })
  .add('@lukeed/uuid', () => {
    lukeed4()
  })
  .add('nanoid', () => {
    nanoid()
  })
  .add('customAlphabet', () => {
    nanoid2()
  })
  .add('uuid v4', () => {
    uuid4()
  })
  .add('secure-random-string', () => {
    srs()
  })
  .add('uid-safe.sync', () => {
    uidSafe.sync(14)
  })
  .add('cuid', () => {
    cuid()
  })
  .add('shortid', () => {
    shortid()
  })
  .add('nanoid/async', {
    defer: true,
    fn(defer) {
      aNanoid().then(() => {
        defer.resolve()
      })
    }
  })
  .add('async customAlphabet', {
    defer: true,
    fn(defer) {
      asyncNanoid2().then(() => {
        defer.resolve()
      })
    }
  })
  .add('async secure-random-string', {
    defer: true,
    fn(defer) {
      srs(() => {
        defer.resolve()
      })
    }
  })
  .add('uid-safe', {
    defer: true,
    fn(defer) {
      uidSafe(14).then(() => {
        defer.resolve()
      })
    }
  })
  .add('uid', () => {
    uid(32)
  })
  .add('nanoid/non-secure', () => {
    nonSecure()
  })
  .add('rndm', () => {
    rndm(21)
  })
  .on('cycle', event => {
    let name = event.target.name.padEnd('async secure-random-string'.length)
    let hz = formatNumber(event.target.hz.toFixed(0)).padStart(10)
    if (event.target.name === 'nanoid/async') {
      name = '\nAsync:\n' + name
    } else if (event.target.name === 'uid') {
      name = '\nNon-secure:\n' + name
    }
    process.stdout.write(`${name}${pico.bold(hz)}${pico.dim(' ops/sec')}\n`)
  })
  .run()
