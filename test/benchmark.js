#!/usr/bin/env node

let crypto = require('crypto')
let { v4: uuid4 } = require('uuid')
let benchmark = require('benchmark')
let { bold } = require('nanocolors')
let shortid = require('shortid')
let cuid = require('cuid')
let rndm = require('rndm')
let srs = require('secure-random-string')
let uid = require('uid-safe')

let { nanoid: aNanoid, customAlphabet: aCustomAlphabet } = require('../async')
let { nanoid, customAlphabet } = require('../')
let { nanoid: nonSecure } = require('../non-secure')

let suite = new benchmark.Suite()

let nanoid2 = customAlphabet('1234567890abcdef-', 10)
let asyncNanoid2 = aCustomAlphabet('1234567890abcdef-', 10)

function formatNumber(number) {
  return String(number)
    .replace(/\d{3}$/, ',$&')
    .replace(/^(\d)(\d{3})/, '$1,$2')
}

suite
  .add('nanoid', () => {
    nanoid()
  })
  .add('customAlphabet', () => {
    nanoid2()
  })
  .add('uuid v4', () => {
    uuid4()
  })
  .add('crypto.randomUUID()', () => {
    crypto.randomUUID({ disableEntropyCache: true })
  })
  .add('uid.sync', () => {
    uid.sync(14)
  })
  .add('secure-random-string', () => {
    srs()
  })
  .add('cuid', () => {
    cuid()
  })
  .add('shortid', () => {
    shortid()
  })
  .add('async nanoid', {
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
  .add('uid', {
    defer: true,
    fn(defer) {
      uid(14).then(() => {
        defer.resolve()
      })
    }
  })
  .add('non-secure nanoid', () => {
    nonSecure()
  })
  .add('rndm', () => {
    rndm(21)
  })
  .on('cycle', event => {
    let name = event.target.name.padEnd('async secure-random-string'.length)
    let hz = formatNumber(event.target.hz.toFixed(0)).padStart(9)
    if (event.target.name === 'async nanoid') {
      name = '\nAsync:\n' + name
    } else if (event.target.name === 'non-secure nanoid') {
      name = '\nNon-secure:\n' + name
    }
    process.stdout.write(`${name}${bold(hz)} ops/sec\n`)
  })
  .run()
