#!/usr/bin/env node

import { writeFile } from 'node:fs/promises'

import { BUILD_PATH, prebuild } from './prebuild.ts'

async function build() {
  let code = await prebuild()
  await writeFile(BUILD_PATH, code)
}

build().catch(e => {
  throw e
})
