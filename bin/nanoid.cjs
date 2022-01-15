#!/usr/bin/env node

let { nanoid, customAlphabet } = require('..')
let { parseArgs } = require('./parseArgs')

let parsedArgs = parseArgs(process.argv)

if (parsedArgs.help) {
  process.stdout.write(`
	Usage
	  $ nanoid [options]

	Options
	  -s, --size       Generated ID size
	  -a, --alphabet   Alphabet to use
	  -h, --help       Show this help

	Examples
	  $ nano --s=15
	  S9sBF77U6sDB8Yg

	  $ nano --size=10 --alphabet=abc
	  bcabababca
`)
  process.exit()
}

let alphabet = parsedArgs.alphabet || parsedArgs.a
let size = parsedArgs.size || parsedArgs.s ? Number(parsedArgs.size ?? parsedArgs.s) : undefined

if (typeof size !== 'undefined' && (Number.isNaN(size) || size <= 0)) {
  process.stderr.write('Size must be positive integer\n')
  process.exit(1)
}

if (alphabet) {
  if (typeof size === 'undefined') {
    process.stderr.write('You must also specify size option, when using custom alphabet\n')
    process.exit(1)
  }
  process.stdout.write(customAlphabet(alphabet, size)())
} else {
  process.stdout.write(nanoid(size))
}

process.stdout.write('\n')
