import { equal, match, rejects } from 'node:assert'
import child from 'node:child_process'
import { join } from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

let exec = promisify(child.exec)

const BIN = join(fileURLToPath(import.meta.url), '..', '..', 'bin', 'nanoid.js')

describe('CLI', () => {
  test('prints unique ID', async () => {
    let { stderr, stdout } = await exec(`node ${BIN}`)
    equal(stderr, '')
    match(stdout, /^[\w-]{21}\n$/)
  })

  test('uses size', async () => {
    let { stderr, stdout } = await exec(`node ${BIN} --size 10`)
    equal(stderr, '')
    match(stdout, /^[\w-]{10}\n$/)
  })

  test('uses alphabet', async () => {
    let { stderr, stdout } = await exec(`node ${BIN} --alphabet abc --size 15`)
    equal(stderr, '')
    match(stdout, /^[abc]{15}\n$/)
  })

  test('shows an error on unknown argument', async () => {
    await rejects(() => exec(`node ${BIN} -test`), /Unknown argument -test/)
  })

  test('shows an error if size is not a number', async () => {
    await rejects(
      () => exec(`node ${BIN} -s abc`),
      /Size must be positive integer/
    )
  })

  test('requires error if size is a negative number', async () => {
    await rejects(
      () => exec(`node ${BIN} --size "-1"`),
      /Size must be positive integer/
    )
  })

  test('displays help', async () => {
    let { stderr, stdout } = await exec(`node ${BIN} --help`)
    equal(stderr, '')
    match(stdout, /Usage/)
    match(stdout, /\$ nanoid \[options]/)
  })
})
