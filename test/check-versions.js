#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'
import { styleText } from 'node:util'

let pkg = JSON.parse(
  readFileSync(join(import.meta.dirname, '../package.json'), 'utf8')
)
let jsr = JSON.parse(
  readFileSync(join(import.meta.dirname, '../jsr.json'), 'utf8')
)

if (pkg.version !== jsr.version) {
  process.stderr.write(
    styleText(
      ['red', 'bold'],
      `Version mismatch: package.json has ${pkg.version}, ` +
        `jsr.json has ${jsr.version}`
    ) + '\n'
  )
  process.exit(1)
}
