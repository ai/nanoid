#!/usr/bin/node --experimental-worker

/* eslint-disable node/no-missing-require */

var isMainThread = require('worker_threads').isMainThread
var parentPort = require('worker_threads').parentPort
var workerData = require('worker_threads').workerData
var UglifyJS = require('uglify-js')
var gzipSize = require('gzip-size')
var Worker = require('worker_threads').Worker
var chalk = require('chalk')
var path = require('path')
var fs = require('fs')

var file
var used = { }

function shuffle (str) {
  var array = str.split('')
  var j, x, i
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = array[i]
    array[i] = array[j]
    array[j] = x
  }
  return array.join('')
}

function shuffleUnique (str) {
  var mixed
  while (true) {
    mixed = shuffle(str)
    if (!used[mixed]) {
      used[mixed] = true
      return mixed
    }
  }
}

function factorial (number) {
  var total = 1
  while (number > 0) {
    total *= number
    number = number - 1
  }
  return total
}

var maxSteps = factorial(64)
var totalSteps = 0

var best = {
  value: '',
  size: Infinity
}
var lastString

function findInitialString () {
  var filePath = path.join(process.cwd(), process.argv[2])
  file = fs.readFileSync(filePath, 'utf8')
  file = UglifyJS.minify(file).code.replace('module.', 'e.')
  file = '!function(e){var t={};function r(n){if(t[n])return t[n].exports;' +
          'var o=t[n]={i:n,l:!1,exports:{}};return ' +
          'e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}' +
          'r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||' +
          'Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){' +
          '"undefined"!=typeof Symbol&&Symbol.toStringTag&&' +
          'Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),' +
          'Object.defineProperty(e,"__esModule",{value:!0})},' +
          'r.t=function(e,t){if(1&t&&(e=r(e)),8&t)' +
          'return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;' +
          'var n=Object.create(null);if(r.r(n),Object.defineProperty(' +
          'n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)' +
          'for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));' +
          'return n},r.n=function(e){var t=e&&e.__esModule?function(){' +
          'return e.default}:function(){return e};return r.d(t,"a",t),t}' +
          ',r.o=function(e,t){return Object.prototype.hasOwnProperty' +
          '.call(e,t)},r.p="",r(r.s=0)}([function(e,t){' + file + '}]);'
  var match = file.match(/[A-Za-z0-9~_]{64}/)
  if (!match) {
    process.stderr.write(chalk.red('Alphabet was not found') + '\n')
    process.exit(1)
  }
}

function shuffleString () {
  lastString = shuffleUnique(lastString)
  file = file.replace(/[A-Za-z0-9~_]{64}/, lastString)
}

var steps = 0
function checkSize () {
  gzipSize(file).then(function (size) {
    size = size - 461
    if (size < best.size) {
      best.value = lastString
      best.size = size
      parentPort.postMessage(best)
    }
    steps += 1
    if (steps === 100000) {
      parentPort.postMessage({ steps: 100000 })
      steps = 0
    }
    shuffleString()
    checkSize()
  })
}

if (isMainThread) {
  findInitialString()
  var stepsReported = 0
  for (var i = 0; i < 8; i++) {
    var worker = new Worker(__filename, {
      workerData: file
    })
    worker.on('message', function (data) {
      if (data.steps) {
        totalSteps += data.steps
        stepsReported += 1
        if (stepsReported === 8) {
          stepsReported = 0
          var percents = 100 * totalSteps / maxSteps
          process.stdout.write(chalk.grey(percents + '%\n'))
        }
      } else if (data.size < best.size) {
        best = data
        process.stdout.write(
          chalk.green.bold(best.size + 'B') + ' ' + best.value + '\n')
      }
    })
    worker.on('error', function (e) {
      throw e
    })
  }
} else {
  file = workerData
  lastString = file.match(/[A-Za-z0-9~_]{64}/)[0]
  checkSize()
}
