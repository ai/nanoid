#!/usr/bin/env node

let { promisify } = require('util')
let { minify } = require('terser')
let { join } = require('path')
let fs = require('fs')

let writeFile = promisify(fs.writeFile)
let readFile = promisify(fs.readFile)

async function build () {
  let js = await readFile(join(__dirname, '..', 'index.browser.js'))
  let func = 'export ' + js.toString().match(/(let nanoid [\W\w]*)\s*module/)[1]
  let { code } = await minify(func)
  await writeFile(join(__dirname, '..', 'nanoid.js'), code)
}

build().catch(e => {
  throw e
})
