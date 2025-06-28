#!/usr/bin/env node

import { v4 as lukeed4 } from '@lukeed/uuid'
import { v4 as napiV4 } from '@napi-rs/uuid'
import crypto from 'node:crypto'
import { styleText } from 'node:util'
import rndm from 'rndm'
import srs from 'secure-random-string'
import shortid from 'shortid'
import { Bench } from 'tinybench'
import { uid } from 'uid'
import uidSafe from 'uid-safe'
import { uid as uidSecure } from 'uid/secure'
// import { ulid } from 'ulid'
import { v4 as uuid4 } from 'uuid'

import { nanoid as browser } from '../index.browser.js'
import { customAlphabet, nanoid } from '../index.js'
import { nanoid as nonSecure } from '../non-secure/index.js'
import { ulid as nanoidUlid } from '../ulid/index.js'

let bench = new Bench()

let nanoid2 = customAlphabet('1234567890abcdef-', 10)

bench
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
  // .add('ulid', () => {
  //   ulid()
  // })
  .add('nanoid/ulid', () => {
    nanoidUlid()
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

let longestTask = bench.tasks.reduce((maxLength, task) => {
  return Math.max(maxLength, task.name.length)
}, 0)

bench.addEventListener('cycle', ({ task }) => {
  let hz = (+task.result.hz.toFixed(0)).toLocaleString('en-US').padStart(14)

  let name = task.name.padEnd(longestTask)
  let value = styleText('bold', hz)
  let units = styleText('dim', 'ops/sec')

  if (task.name === 'uid') {
    process.stdout.write('\nNon-secure:\n')
  }

  process.stdout.write(`${name}${value} ${units}\n`)
})

await bench.run({ warmup: true })
