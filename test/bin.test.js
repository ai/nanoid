let { is, match } = require('uvu/assert')
let { promisify } = require('util')
let { test } = require('uvu')
let { join } = require('path')
let child = require('child_process')

let exec = promisify(child.exec)

const BIN = join(__dirname, '..', 'bin', 'nanoid.cjs')

test('prints unique ID', async () => {
  let { stdout, stderr } = await exec('node ' + BIN)
  is(stderr, '')
  match(stdout, /^[\w-]{21}\n$/)
})

test('uses size', async () => {
  let { stdout, stderr } = await exec('node ' + BIN + ' --size 10')
  is(stderr, '')
  match(stdout, /^[\w-]{10}\n$/)
})

test('uses alphabet', async () => {
  let { stdout, stderr } = await exec(
    'node ' + BIN + ' --alphabet abc --size 15'
  )
  is(stderr, '')
  match(stdout, /^[abc]{15}\n$/)
})

test('shows an error on unknown argument', async () => {
  try {
    await exec('node ' + BIN + ' -test')
  } catch (e) {
    match(e, /Unknown argument -test/)
  }
})

test('shows an error if size is not a number', async () => {
  try {
    await exec('node ' + BIN + ' -s abc')
  } catch (e) {
    match(e, /Size must be positive integer/)
  }
})

test('requires error if size is a negative number', async () => {
  try {
    await exec('node ' + BIN + ' --size "-1"')
  } catch (e) {
    match(e, /Size must be positive integer/)
  }
})

test('displays help', async () => {
  let { stdout, stderr } = await exec('node ' + BIN + ' --help')
  is(stderr, '')
  match(stdout, /Usage/)
  match(stdout, /\$ nanoid \[options]/)
})

test.run()
