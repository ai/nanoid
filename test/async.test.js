let crypto = require('crypto')

global.crypto = {
  getRandomValues (array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

let browser = require('../async/index.browser.js')
let node = require('../async/index.js')

let { urlAlphabet } = require('..')

function times (size, callback) {
  let array = []
  for (let i = 0; i < size; i++) {
    array.push(1)
  }
  return array.map(callback)
}

for (let type of ['node', 'browser']) {
  describe(`${ type }`, () => {
    let { nanoid, customAlphabet } = type === 'node' ? node : browser

    describe('nanoid', () => {
      function mock (callback) {
        crypto.randomFill = callback
        jest.resetModules()
        nanoid = require('../async').nanoid
      }
      if (type === 'node') {
        let originFill = crypto.randomFill
        afterEach(() => {
          mock(originFill)
        })
      }

      it('generates URL-friendly IDs', async () => {
        await Promise.all(times(100, async () => {
          let id = await nanoid()
          expect(id).toHaveLength(21)
          expect(typeof id).toEqual('string')
          for (let char of id) {
            expect(urlAlphabet).toContain(char)
          }
        }))
      })

      it('changes ID length', async () => {
        let id = await nanoid(10)
        expect(id).toHaveLength(10)
      })

      it('has no collisions', async () => {
        let ids = await Promise.all(times(100 * 1000, () => nanoid()))
        ids.reduce((used, id) => {
          expect(used[id]).toBeUndefined()
          used[id] = true
          return used
        }, [])
      })

      it('has flat distribution', async () => {
        let COUNT = 100 * 1000
        let LENGTH = (await nanoid()).length

        let chars = { }
        await Promise.all(times(COUNT, async () => {
          let id = await nanoid()
          for (let char of id) {
            if (!chars[char]) chars[char] = 0
            chars[char] += 1
          }
        }))
        expect(Object.keys(chars)).toHaveLength(urlAlphabet.length)
        let max = 0
        let min = Number.MAX_SAFE_INTEGER
        for (let k in chars) {
          let distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
          if (distribution > max) max = distribution
          if (distribution < min) min = distribution
        }
        expect(max - min).toBeLessThanOrEqual(0.05)
      })

      if (type === 'node') {
        it('rejects Promise on error', async () => {
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
          expect(catched).toBe(error)
        })
      }
    })

    describe('customAlphabet', () => {
      it('has options', async () => {
        let nanoidA = customAlphabet('a', 5)
        let id = await nanoidA()
        expect(id).toEqual('aaaaa')
      })

      it('has flat distribution', async () => {
        let COUNT = 100 * 1000
        let LENGTH = 30
        let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
        let nanoid2 = customAlphabet(ALPHABET, LENGTH)

        let chars = { }
        await Promise.all(times(100, async () => {
          let id = await nanoid2()
          expect(id).toHaveLength(LENGTH)
          for (let char of id) {
            if (!chars[char]) chars[char] = 0
            chars[char] += 1
          }
        }))
        expect(Object.keys(chars)).toHaveLength(ALPHABET.length)
        let max = 0
        let min = Number.MAX_SAFE_INTEGER
        for (let k in chars) {
          let distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
          if (distribution > max) max = distribution
          if (distribution < min) min = distribution
        }
        expect(max - min).toBeLessThanOrEqual(0.05)
      })
    })
  })
}
