#!/usr/bin/env node

var minimist = require('minimist');
var generate = require('./generate');
var alphabet = require('./url');

var options = minimist(process.argv.slice(2), {
  string: ['alphabet'],
  alias: {
    alphabet: 'a',
    size: 's'
  },
  default: {
    alphabet: alphabet,
    size: 21
  }
});

process.stdout.write(generate(options.alphabet, options.size));
