#!/usr/bin/env node

import { uid as uidSecure } from 'uid/secure'
import { v4 as lukeed4 } from '@lukeed/uuid'
import { v4 as napiV4 } from '@napi-rs/uuid'
import { v4 as uuid4 } from 'uuid'
import benchmark from 'benchmark'
import shortid from 'shortid'
import uidSafe from 'uid-safe'
import { uid } from 'uid'
import crypto from 'crypto'
import pico from 'picocolors'
import rndm from 'rndm'
import srs from 'secure-random-string'

import {
  customAlphabet as aCustomAlphabet,
  nanoid as aNanoid
} from '../async/index.js'
import { nanoid, customAlphabet } from '../index.js'
import { nanoid as nonSecure } from '../non-secure/index.js'

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
  .add('uuid v4', () => {
    uuid4()
  })
  .add('@napi-rs/uuid', () => {
    napiV4()
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
  .add('secure-random-string', () => {
    srs()
  })
  .add('uid-safe.sync', () => {
    uidSafe.sync(14)
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
