var parentPort = require('worker_threads').parentPort
var workerData = require('worker_threads').workerData
var gzipSize = require('gzip-size')

var used = new Set()

function getAlphabet (positions) {
  var alphabet = ''
  positions.forEach(function (pos) {
    if (pos === -1) return
    var word = ''
    while (pos < workerData.js.length) {
      var char = workerData.js[pos]
      if (workerData.alphabet.indexOf(char) === -1) break
      if (alphabet.indexOf(char) !== -1) break
      if (word.indexOf(char) !== -1) break
      word += char
      pos++
    }
    if (word.length >= 3) alphabet += word
  })

  if (alphabet.length <= 10 || used.has(alphabet)) return false
  used.add(alphabet)

  for (var i = 0; i < workerData.alphabet.length; i++) {
    var char = workerData.alphabet[i]
    if (alphabet.indexOf(char) === -1) {
      alphabet += char
    }
  }
  return alphabet
}

var positions = [workerData.start, -1, -1]

function increase () {
  positions[2] += 1
  if (positions[2] >= workerData.js.length) {
    positions[2] = 0
    positions[1] += 1
    if (positions[1] >= workerData.js.length) {
      positions[2] = -1
      positions[1] = -1
      positions[0] += workerData.step
      if (positions[0] >= workerData.js.length) {
        return false
      }
    }
  }
  return true
}

var steps = 0

function tick () {
  if (!increase(positions)) {
    parentPort.postMessage({ finished: true })
  } else {
    steps += 1
    var alphabet = getAlphabet(positions)
    if (alphabet) {
      var file = workerData.js.replace(/[A-Za-z0-9~_]{30,}/, alphabet)
      gzipSize(file).then(function (size) {
        parentPort.postMessage({
          alphabet: alphabet,
          steps: steps,
          size: size
        })
        steps = 0
        tick()
      })
    } else {
      Promise.resolve().then(tick)
    }
  }
}

tick()
