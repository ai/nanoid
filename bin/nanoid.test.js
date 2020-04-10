let { promisify } = require('util')
let { join } = require('path')
let child = require('child_process')

let exec = promisify(child.exec)

it('prints unique ID', async () => {
  let { stdout, stderr } = await exec('node ' + join(__dirname, 'nanoid.cjs'))
  expect(stderr).toEqual('')
  expect(stdout).toMatch(/^[\w-]{21}\n$/)
})
