let { suite } = require('uvu')
let { is, match, equal } = require('uvu/assert')
let { promisify } = require('util')
let { join } = require('path')
let child = require('child_process')

let { parseArgs } = require('./utils')

let exec = promisify(child.exec)

const nanoIdSuit = suite('nanoid')

nanoIdSuit('prints unique ID', async () => {
  let { stdout, stderr } = await exec('node ' + join(__dirname, 'nanoid.cjs'))
  is(stderr, '')
  match(stdout, /^[\w-]{21}\n$/)
})

nanoIdSuit('uses size', async () => {
  let { stdout, stderr } = await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --size=10')
  is(stderr, '')
  match(stdout, /^[\w-]{10}\n$/)
})

nanoIdSuit('uses alphabet', async () => {
  let { stdout, stderr } = await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --alphabet=abc --size=15')
  is(stderr, '')
  match(stdout, /^[abc]{15}\n$/)
})

nanoIdSuit('show an error if size is not a number', async () => {
  try {
    await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --s abc')
  } catch (e) {
    match(e, /Size must be positive integer/)
  }
})

nanoIdSuit('shows an error if size is not provided when using custom alphabet', async () => {
  try {
    await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --alphabet abc')
  } catch (e) {
    match(e, /You must also specify size option, when using custom alphabet/)
  }
})

nanoIdSuit('requires error if size is a negative number', async () => {
  try {
    await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --size "-1"')
  } catch (e) {
    match(e, /Size must be positive integer/)
  }
})

nanoIdSuit('displays help', async () => {
  let { stdout, stderr } = await exec('node ' + join(__dirname, 'nanoid.cjs') + ' --help')
  is(stderr, '')
  match(stdout, /Usage/)
  match(stdout, /\$ nanoid \[options]/)
})

nanoIdSuit.run()

const parseArgsSuite = suite('parseArgs')

parseArgsSuite('parses args', () => {
  equal(parseArgs(['node', 'nanoid.cjs', '--help']), { help: true })
  equal(parseArgs(['node', 'nanoid.cjs', '--help', '--size=30']), { help: true, size: '30' })
  equal(parseArgs(['node', 'nanoid.cjs', '--help', '-s', '30']), { help: true, s: '30' })
  equal(parseArgs(['node', 'nanoid.cjs', '--help', '-size', '30']), { help: true, size: '30' })
  equal(parseArgs(['node', 'nanoid.cjs', '--help', '-size', '30', '-alphabet', 'abc']), { help: true, size: '30', alphabet: 'abc' })
})

parseArgsSuite.run()
