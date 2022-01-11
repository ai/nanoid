global.crypto = {
  getRandomValues(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

let browser = require('../index.browser.js')
let node = require('../index.js')

for (let type of ['node', 'browser']) {
  describe(`${type}`, () => {
    let { nanoid, customAlphabet, customRandom, random, urlAlphabet } =
      type === 'node' ? node : browser

    describe('nanoid', () => {
      it('generates URL-friendly IDs', () => {
        for (let i = 0; i < 100; i++) {
          let id = nanoid()
          expect(id).toHaveLength(21)
          expect(typeof id).toBe('string')
          for (let char of id) {
            expect(urlAlphabet).toContain(char)
          }
        }
      })

      it('changes ID length', () => {
        expect(nanoid(10)).toHaveLength(10)
      })

      it('accepts string', () => {
        expect(nanoid('10')).toHaveLength(10)
      })

      it('has no collisions', () => {
        let used = {}
        for (let i = 0; i < 50 * 1000; i++) {
          let id = nanoid()
          expect(used[id]).toBeUndefined()
          used[id] = true
        }
      })

      it('has flat distribution', () => {
        let COUNT = 100 * 1000
        let LENGTH = nanoid().length

        let chars = {}
        for (let i = 0; i < COUNT; i++) {
          let id = nanoid()
          for (let char of id) {
            if (!chars[char]) chars[char] = 0
            chars[char] += 1
          }
        }

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
    })

    describe('customAlphabet', () => {
      it('has options', () => {
        let nanoidA = customAlphabet('a', 5)
        expect(nanoidA()).toBe('aaaaa')
      })

      it('has flat distribution', () => {
        let COUNT = 50 * 1000
        let LENGTH = 30
        let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
        let nanoid2 = customAlphabet(ALPHABET, LENGTH)

        let chars = {}
        for (let i = 0; i < COUNT; i++) {
          let id = nanoid2()
          for (let char of id) {
            if (!chars[char]) chars[char] = 0
            chars[char] += 1
          }
        }

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

    describe('customRandom', () => {
      it('supports generator', () => {
        let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
        function fakeRandom(size) {
          let bytes = []
          for (let i = 0; i < size; i += sequence.length) {
            bytes = bytes.concat(sequence.slice(0, size - i))
          }
          return bytes
        }
        let nanoid4 = customRandom('abcde', 4, fakeRandom)
        let nanoid18 = customRandom('abcde', 18, fakeRandom)
        expect(nanoid4()).toBe('adca')
        expect(nanoid18()).toBe('cbadcbadcbadcbadcc')
      })
    })

    describe('urlAlphabet', () => {
      it('is string', () => {
        expect(typeof urlAlphabet).toBe('string')
      })

      it('has no duplicates', () => {
        for (let i = 0; i < urlAlphabet.length; i++) {
          expect(urlAlphabet.lastIndexOf(urlAlphabet[i])).toEqual(i)
        }
      })
    })

    describe('random', () => {
      it('generates small random buffers', () => {
        expect(random(10)).toHaveLength(10)
      })

      it('generates random buffers', () => {
        let numbers = {}
        let bytes = random(10000)
        expect(bytes).toHaveLength(10000)
        for (let byte of bytes) {
          if (!numbers[byte]) numbers[byte] = 0
          numbers[byte] += 1
          expect(typeof byte).toBe('number')
          expect(byte).toBeLessThanOrEqual(255)
          expect(byte).toBeGreaterThanOrEqual(0)
        }
      })
    })

    if (type === 'node') {
      describe('proxy number', () => {
        it('prevent collision', () => {
          let makeProxyNumberToReproducePreviousID = () => {
            let step = 0
            return {
              valueOf() {
                // "if (!pool || pool.length < bytes) {"
                if (step === 0) {
                  step++
                  return 0
                }
                // "} else if (poolOffset + bytes > pool.length) {"
                if (step === 1) {
                  step++
                  return -Infinity
                }
                // "poolOffset += bytes"
                if (step === 2) {
                  step++
                  return 0
                }

                return 21
              }
            }
          }

          let ID1 = nanoid()
          let ID2 = nanoid(makeProxyNumberToReproducePreviousID())

          expect(ID1).not.toBe(ID2)
        })
      })
    }
  })
}
