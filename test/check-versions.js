#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

let dir = dirname(fileURLToPath(import.meta.url))
let pkg = JSON.parse(readFileSync(join(dir, '../package.json'), 'utf8'))
let jsr = JSON.parse(readFileSync(join(dir, '../jsr.json'), 'utf8'))

if (pkg.version !== jsr.version) {
  process.stderr.write(
    `Version mismatch: package.json has ${pkg.version}, jsr.json has ${jsr.version}\n`
  )
  process.exit(1)
}
