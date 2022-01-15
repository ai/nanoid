let { suite } = require('uvu')
let { is, match, equal } = require('uvu/assert')
let { promisify } = require('util')
let { join } = require('path')
let child = require('child_process')

let { parseArgs } = require('./parseArgs')

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
