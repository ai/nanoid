var generate = require('../../generate')
var random = require('../../random')
var nanoid = require('../../')

var html = ''
for (var i = 0; i < 10; i++) {
  html += '<div>' + nanoid() + '</div>'
}
document.body.innerHTML = '<main>' + html + '</main>'

var COUNT = 50 * 1000
var STEP = 5000
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
var LENGTH = ALPHABET.length

function print (title, chars) {
  var length = Object.keys(chars).length
  var width = 100 / length

  var dots = ''
  Object.keys(chars).sort().forEach(function (l) {
    var distribution = (chars[l] * length) / (COUNT * LENGTH)
    dots += '<div class="dot" style="' +
      'background: hsl(' + (200 * distribution) + ', 100%, 50%); ' +
      'width: ' + width + '%; ' +
    '">' + l + '</div>'
  })

  document.body.innerHTML += '<section>' +
    '<h2>' + title + '</h2>' +
    dots +
  '</section>'
}

function printDistribution (title, fn) {
  var steps = COUNT
  var chars = { }

  return new Promise(function (resolve) {
    function step () {
      if (steps === 0) {
        print(title, chars)
        resolve()
        return
      }

      setTimeout(function () {
        for (var j = 0; j < STEP; j++) {
          var id = fn()
          for (var k = 0; k < id.length; k++) {
            var char = id[k]
            if (!chars[char]) chars[char] = 0
            chars[char] += 1
          }
        }
        steps -= STEP
        step()
      })
    }
    step()
  })
}

var tasks = [
  function () {
    return printDistribution('ideal', function () {
      return Array(LENGTH).fill().map(function (_, index) {
        return ALPHABET[index]
      })
    })
  },
  function () {
    return printDistribution('nanoid', function () {
      return generate(ALPHABET, LENGTH)
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
    run()
  })
}

run()
