#!/usr/bin/env node

import { v4 as lukeed4 } from '@lukeed/uuid'
import { v4 as napiV4 } from '@napi-rs/uuid'
import benchmark from 'benchmark'
import crypto from 'node:crypto'
import rndm from 'rndm'
import srs from 'secure-random-string'
import shortid from 'shortid'
import { uid } from 'uid'
import uidSafe from 'uid-safe'
import { uid as uidSecure } from 'uid/secure'
import { v4 as uuid4 } from 'uuid'
import { styleText } from 'node:util'

import { nanoid as browser } from '../index.browser.js'
import { customAlphabet, nanoid } from '../index.js'
import { nanoid as nonSecure } from '../non-secure/index.js'

let suite = new benchmark.Suite()

let nanoid2 = customAlphabet('1234567890abcdef-', 10)

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
  .add('nanoid for browser', () => {
    browser()
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
    if (event.target.name === 'uid') {
      name = '\nNon-secure:\n' + name
    }
    process.stdout.write(
      `${name}${styleText('bold', hz)}${styleText('dim', ' ops/sec')}\n`
    )
  })
  .run()
