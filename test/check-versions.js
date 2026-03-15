#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { styleText } from 'node:util'

const ROOT = join(import.meta.dirname, '..')

let pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
let jsr = JSON.parse(readFileSync(join(ROOT, 'jsr.json'), 'utf8'))

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
