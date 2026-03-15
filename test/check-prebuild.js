#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { styleText } from 'node:util'

import { BUILD_PATH, prebuild } from './prebuild.ts'

let [current, expected] = await Promise.all([
  readFile(BUILD_PATH, 'utf8'),
  prebuild()
])

if (current !== expected) {
  process.stderr.write(
    styleText(
      ['red', 'bold'],
      'nanoid.js is outdated, run node test/update-prebuild.js'
    ) + '\n'
  )
  process.exit(1)
}
