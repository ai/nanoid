#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

let pkg = JSON.parse(
  readFileSync(join(import.meta.dirname, '../package.json'), 'utf8')
)
let jsr = JSON.parse(
  readFileSync(join(import.meta.dirname, '../jsr.json'), 'utf8')
)

if (pkg.version !== jsr.version) {
  process.stderr.write(
    `Version mismatch: package.json has ${pkg.version}, jsr.json has ${jsr.version}\n`
  )
  process.exit(1)
}
