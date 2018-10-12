/* eslint-disable node/no-missing-require */

var parentPort = require('worker_threads').parentPort
var workerData = require('worker_threads').workerData
var gzipSize = require('gzip-size')

function getAlphabet (positions) {
  var alphabet = ''
  positions.forEach(function (pos) {
    while (pos < workerData.js.length) {
      var char = workerData.js[pos]
      if (workerData.alphabet.indexOf(char) === -1) break
      if (alphabet.indexOf(char) !== -1) break
      alphabet += char
      pos++
    }
  })
  if (alphabet.length <= 10) {
    return false
  }
  for (var i = 0; i < workerData.alphabet.length; i++) {
    var char = workerData.alphabet[i]
    if (alphabet.indexOf(char) === -1) {
      alphabet += char
    }
  }
  return alphabet
}

var positions = [workerData.start, 0, 0]

function increase () {
  positions[2] += 1
  if (positions[2] >= workerData.js.length) {
    positions[2] = 0
    positions[1] += 1
    if (positions[1] >= workerData.js.length) {
      positions[1] = 0
      positions[0] += workerData.step
      if (positions[0] >= workerData.js.length) {
        return false
      }
    }
  }
  return true
}

function tick () {
  if (!increase(positions)) {
    parentPort.postMessage({ finished: true })
  } else {
    var alphabet = getAlphabet(positions)
    if (alphabet) {
      var file = workerData.js.replace(/[A-Za-z0-9~_]{30,}/, alphabet)
      gzipSize(file).then(function (size) {
        parentPort.postMessage({
          alphabet: alphabet,
          size: size
        })
        tick()
      })
    } else {
      parentPort.postMessage({ tick: true })
      tick()
    }
  }
}

tick()
