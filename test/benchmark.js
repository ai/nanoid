#!/usr/bin/env node

import { v4 as lukeed4 } from '@lukeed/uuid'
import { v4 as napiV4 } from '@napi-rs/uuid'
import { styleText } from 'node:util'
import { nopeid } from 'nope-id'
import rndm from 'rndm'
import srs from 'secure-random-string'
import { Bench } from 'tinybench'
import { uid } from 'uid'
import uidSafe from 'uid-safe'
import { uid as uidSecure } from 'uid/secure'
import { v4 as uuid4 } from 'uuid'

import { nanoid as browser } from '../index.browser.js'
import { nanoid, customAlphabet } from '../index.js'
import { nanoid as nonSecure } from '../non-secure/index.js'

let bench = new Bench()

// Fast functions take less time than reading the timer,
// so every task calls the function N times in a loop.
const N = 1000
// Keep the results, so V8 cannot skip creating the IDs
let out = []

let nanoid2 = customAlphabet('1234567890abcdef-', 21)

bench
  .add('nope-id', () => {
    for (let i = 0; i < N; i++) out[i] = nopeid()
  })
  .add('nanoid', () => {
    for (let i = 0; i < N; i++) out[i] = nanoid()
  })
  .add('customAlphabet', () => {
    for (let i = 0; i < N; i++) out[i] = nanoid2()
  })
  .add('crypto.randomUUID', () => {
    for (let i = 0; i < N; i++) out[i] = crypto.randomUUID()
  })
  .add('uuid v4', () => {
    for (let i = 0; i < N; i++) out[i] = uuid4()
  })
  .add('@napi-rs/uuid', () => {
    for (let i = 0; i < N; i++) out[i] = napiV4()
  })
  .add('uid/secure', () => {
    for (let i = 0; i < N; i++) out[i] = uidSecure(32)
  })
  .add('@lukeed/uuid', () => {
    for (let i = 0; i < N; i++) out[i] = lukeed4()
  })
  .add('nanoid for browser', () => {
    for (let i = 0; i < N; i++) out[i] = browser()
  })
  .add('secure-random-string', () => {
    for (let i = 0; i < N; i++) out[i] = srs()
  })
  .add('uid-safe.sync', () => {
    for (let i = 0; i < N; i++) out[i] = uidSafe.sync(14)
  })
  .add('uid', () => {
    for (let i = 0; i < N; i++) out[i] = uid(32)
  })
  .add('nanoid/non-secure', () => {
    for (let i = 0; i < N; i++) out[i] = nonSecure()
  })
  .add('rndm', () => {
    for (let i = 0; i < N; i++) out[i] = rndm(21)
  })

let longestTask = bench.tasks.reduce((maxLength, task) => {
  return Math.max(maxLength, task.name.length)
}, 0)

bench.addEventListener('cycle', ({ task }) => {
  // Total calls divided by total time. The mean of sample
  // throughputs is too high, because slow samples count less there.
  let hz = Math.round((N * 1000) / task.result.latency.mean)
    .toLocaleString('en-US')
    .padStart(14)

  let name = task.name.padEnd(longestTask)
  let value = styleText('bold', hz)
  let units = styleText('dim', 'ops/sec')

  if (task.name === 'uid') {
    process.stdout.write('\nNon-secure:\n')
  }

  process.stdout.write(`${name}${value} ${units}\n`)
})

await bench.run({ warmup: true })
