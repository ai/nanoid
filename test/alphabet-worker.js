let parentPort = require('worker_threads').parentPort
let workerData = require('worker_threads').workerData
let gzipSize = require('gzip-size')

let used = new Set()

function getAlphabet (positions) {
  let alphabet = ''
  for (let pos of positions) {
    if (pos === -1) return
    let word = ''
    while (pos < workerData.js.length) {
      let char = workerData.js[pos]
      if (workerData.alphabet.indexOf(char) === -1) break
      if (alphabet.indexOf(char) !== -1) break
      if (word.indexOf(char) !== -1) break
      word += char
      pos++
    }
    if (word.length >= 3) alphabet += word
  }

  if (alphabet.length <= 10 || used.has(alphabet)) return false
  used.add(alphabet)

  for (let i = 0; i < workerData.alphabet.length; i++) {
    let char = workerData.alphabet[i]
    if (!alphabet.includes(char)) {
      alphabet += char
    }
  }
  return alphabet
}

let positions = [workerData.start, -1, -1]

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

let steps = 0

function tick () {
  if (!increase(positions)) {
    parentPort.postMessage({ finished: true })
  } else {
    steps += 1
    let alphabet = getAlphabet(positions)
    if (alphabet) {
      let file = workerData.js.replace(/[A-Za-z0-9-_]{30,}/, alphabet)
      gzipSize(file).then(size => {
        parentPort.postMessage({ alphabet, steps, size })
        steps = 0
        tick()
      })
    } else {
      Promise.resolve().then(tick)
    }
  }
}

tick()
