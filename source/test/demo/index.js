var shortid = require('shortid')
var uuid4 = require('uuid/v4')
var rndm = require('rndm')
var uid = require('uid-safe')

var nonSecure = require('../../non-secure')
var generate = require('../../generate')
var random = require('../../random')
var nanoid = require('../../')

var html = ''
for (var i = 0; i < 10; i++) {
  html += '<div>' + nanoid() + '</div>'
}
document.body.innerHTML = '<main>' + html + '</main>'

var COUNT = 50 * 1000
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
var LENGTH = ALPHABET.length

function print (number) {
  return String(Math.floor(number * 100))
    .replace(/\d\d\d\d\d\d$/, ',$&')
    .replace(/\d\d\d$/, ',$&')
}

function printDistribution (title, fn) {
  return calcDistribution(title, fn).then(function (data) {
    var length = Object.keys(data.chars).length
    var dots = ''

    var average = Object.keys(data.chars).reduce(function (all, l) {
      return all + data.chars[l]
    }, 0) / length

    Object.keys(data.chars).sort().forEach(function (l) {
      var distribution = data.chars[l] / average
      dots += '<div class="dot" style="' +
        'background: hsl(' + (200 * distribution) + ', 100%, 50%); ' +
        'width: ' + (100 / length) + '%; ' +
      '">' + l + '</div>'
    })

    document.body.innerHTML += '<section>' +
      '<span>' + print(COUNT * 1000 / data.time) + ' ops/sec</span>' +
      '<h2>' + data.title + '</h2>' +
      dots +
    '</section>'
  })
}

function calcDistribution (title, fn) {
  var chars = { }

  return new Promise(function (resolve) {
    var ids = []
    var j

    var start = Date.now()
    for (j = 0; j < COUNT; j++) ids.push(fn())
    var end = Date.now()

    for (j = 0; j < COUNT; j++) {
      var id = ids[j]
      if (title === 'uuid/v4') id = id.replace(/-./g, '')
      for (var k = 0; k < id.length; k++) {
        var char = id[k]
        if (!chars[char]) chars[char] = 0
        chars[char] += 1
      }
    }

    resolve({ title: title, chars: chars, time: end - start })
  })
}

var tasks = [
  function () {
    return printDistribution('ideal', function () {
      var result = []
      for (var j = 0; j < LENGTH; j++) {
        result.push(ALPHABET[j])
      }
      return result
    })
  },
  function () {
    return printDistribution('nanoid', function () {
      return nanoid()
    })
  },
  function () {
    return printDistribution('nanoid/generate', function () {
      return generate(ALPHABET, LENGTH)
    })
  },
  function () {
    return printDistribution('uid.sync', function () {
      return uid.sync(21)
    })
  },
  function () {
    return printDistribution('uuid/v4', function () {
      return uuid4()
    })
  },
  function () {
    return printDistribution('shortid', function () {
      return shortid()
    })
  },
  function () {
    return printDistribution('rndm', function () {
      return rndm()
    })
  },
  function () {
    return printDistribution('nanoid/non-secure', function () {
      return nonSecure()
    })
  },
  function () {
    return printDistribution('random % alphabet', function () {
      return [].slice.call(random(LENGTH)).map(function (num) {
        return ALPHABET[num % ALPHABET.length]
      })
    })
  }
]

function run () {
  if (tasks.length === 0) return
  var task = tasks.shift()
  task().then(function () {
    setTimeout(run, 10)
  })
}

run()
