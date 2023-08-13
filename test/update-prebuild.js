#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { minify } from 'terser'
import { fileURLToPath } from 'url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

async function build() {
  let js = await readFile(join(ROOT, 'index.browser.js'))
  let func = js.toString().match(/(export let nanoid [\W\w]*$)/)[1]
  let { code } = await minify(func)
  await writeFile(join(ROOT, 'nanoid.js'), code)
}

build().catch(e => {
  throw e
})
