#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { minify } from 'terser'

import { urlAlphabet } from '../url-alphabet/index.js'

const ROOT = join(import.meta.dirname, '..')

async function build() {
  let js = await readFile(join(ROOT, 'index.browser.js'))
  let func = js.toString().match(/(export let nanoid [\W\w]*$)/)[1]
  let all = `let a = '${urlAlphabet}'\n${func.replaceAll('urlAlphabet', 'a')}`
  let { code } = await minify(all)
  await writeFile(join(ROOT, 'nanoid.js'), code)
}

build().catch(e => {
  throw e
})
