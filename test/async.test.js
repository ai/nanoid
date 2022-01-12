let { suite } = require('uvu')
let { spy } = require('nanospy')
let { is, match, ok } = require('uvu/assert')
let crypto = require('crypto')

global.crypto = {
  getRandomValues(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

let { urlAlphabet } = require('..')
let browser = require('../async/index.browser.js')
let node = require('../async/index.js')

function times(size, callback) {
  let array = []
  for (let i = 0; i < size; i++) {
    array.push(1)
  }
  return array.map(callback)
}

for (let type of ['node', 'browser']) {
  let { nanoid, customAlphabet, random } = type === 'node' ? node : browser

  function mock(callback) {
    crypto.randomFill = callback
    delete require.cache[require.resolve('../async')]
    nanoid = require('../async').nanoid
  }

  let nanoidSuite = suite(`${type} / nanoid`)

  if (type === 'node') {
    let originFill = crypto.randomFill
    nanoidSuite.after.each(() => {
      mock(originFill)
    })
  }

  nanoidSuite('generates URL-friendly IDs', async () => {
    await Promise.all(
      times(100, async () => {
        let id = await nanoid()
        is(id.length, 21)
        is(typeof id, 'string')
        for (let char of id) {
          match(urlAlphabet, new RegExp(char, "g"))
        }
      })
    )
  })

  nanoidSuite('changes ID length', async () => {
    let id = await nanoid(10)
    is(id.length, 10)
  })

  nanoidSuite('has no collisions', async () => {
    let ids = await Promise.all(times(50 * 1000, () => nanoid()))
    ids.reduce((used, id) => {
      is(used[id], undefined)
      used[id] = true
      return used
    }, [])
  })

  nanoidSuite('has flat distribution', async () => {
    let COUNT = 100 * 1000
    let LENGTH = (await nanoid()).length

    let chars = {}
    await Promise.all(
      times(COUNT, async () => {
        let id = await nanoid()
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      })
    )
    is(Object.keys(chars).length, urlAlphabet.length)
    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (let k in chars) {
      let distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
      if (distribution > max) max = distribution
      if (distribution < min) min = distribution
    }
    ok(max - min <= 0.05)
  })

  if (type === 'node') {
    nanoidSuite('rejects Promise on error', async () => {
      let error = new Error('test')
      mock((buffer, callback) => {
        callback(error)
      })
      let catched
      try {
        await nanoid()
      } catch (e) {
        catched = e
      }
      is(catched, error)
    })
  }

  nanoidSuite.run()

  let randomSuite = suite(`${type} / random`)

  randomSuite('generates small random buffers', async () => {
    is((await random(10)).length, 10)
  })

  randomSuite('generates random buffers', async () => {
    let numbers = {}
    let bytes = await random(10000)
    is(bytes.length, 10000)
    for (let byte of bytes) {
      if (!numbers[byte]) numbers[byte] = 0
      numbers[byte] += 1
      is(typeof byte, 'number')
      ok(byte <= 255)
      ok(byte >= 0)
    }
  })

  randomSuite.run()

  let customAlphabetSuite = suite(`${type} / customAlphabet`)

  if (type === 'node') {
    let originFill = crypto.randomFill
    customAlphabetSuite.after.each(() => {
      mock(originFill)
    })
  }

  customAlphabetSuite('has options', async () => {
    let nanoidA = customAlphabet('a', 5)
    let id = await nanoidA()
    is(id, 'aaaaa')
  })

  customAlphabetSuite('has flat distribution', async () => {
    let COUNT = 50 * 1000
    let LENGTH = 30
    let ALPHABET = 'abcdefghijklmnopqrstuvwxy'
    let nanoid2 = customAlphabet(ALPHABET, LENGTH)

    let chars = {}
    await Promise.all(
      times(100, async () => {
        let id = await nanoid2()
        is(id.length, LENGTH)
        for (let char of id) {
          if (!chars[char]) chars[char] = 0
          chars[char] += 1
        }
      })
    )
    is(Object.keys(chars).length, ALPHABET.length)
    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (let k in chars) {
      let distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
      if (distribution > max) max = distribution
      if (distribution < min) min = distribution
    }
    ok(max - min <= 0.05)
  })

  if (type === 'node') {
    customAlphabetSuite('should call random two times', async () => {
      let randomFillMock = spy((buffer, callback) =>
        callback(null, [220, 215, 129, 35, 242, 202, 137, 180])
      )
      mock(randomFillMock)

      let nanoidA = customAlphabet('a', 5)
      let id = await nanoidA()

      is(randomFillMock.callCount, 2)
      is(id, 'aaaaa')
    })
  }

  customAlphabetSuite.run()
}
