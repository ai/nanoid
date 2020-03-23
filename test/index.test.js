global.self = {
  crypto: {
    getRandomValues (array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }
}

let browser = require('../index.browser.js')
let node = require('../index.js')

for (let type of ['node', 'browser']) {
  describe(`${ type }`, () => {
    let { nanoid, nanoid2, nanoid3, random, urlAlphabet } =
      type === 'node' ? node : browser

    describe('nanoid', () => {
      it('generates URL-friendly IDs', () => {
        for (let i = 0; i < 100; i++) {
          let id = nanoid()
          expect(id).toHaveLength(21)
          expect(typeof id).toEqual('string')
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
        let used = { }
        for (let i = 0; i < 100 * 1000; i++) {
          let id = nanoid()
          expect(used[id]).toBeUndefined()
          used[id] = true
        }
      })

      it('has flat distribution', () => {
        let COUNT = 100 * 1000
        let LENGTH = nanoid().length

        let chars = { }
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

    describe('nanoid2', () => {
      it('has options', () => {
        expect(nanoid2(5, 'a')).toEqual('aaaaa')
      })

      it('has flat distribution', () => {
        let COUNT = 100 * 1000
        let LENGTH = 5
        let ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

        let chars = { }
        for (let i = 0; i < COUNT; i++) {
          let id = nanoid2(LENGTH, ALPHABET)
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

    describe('nanoid3', () => {
      it('supports generator', () => {
        let sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
        function customRandom (size) {
          let bytes = []
          for (let i = 0; i < size; i += sequence.length) {
            bytes = bytes.concat(sequence.slice(0, size - i))
          }
          return bytes
        }
        expect(nanoid3(4, 'abcde', customRandom)).toEqual('adca')
        expect(nanoid3(18, 'abcde', customRandom)).toEqual('cbadcbadcbadcbadcc')
      })

      it('respects size', () => {
        expect(nanoid3(4, 'abcde', random)).toHaveLength(4)
        expect(nanoid3(20, 'abcde', random)).toHaveLength(20)
      })
    })

    describe('urlAlphabet', () => {
      it('is string', () => {
        expect(typeof urlAlphabet).toEqual('string')
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
        let numbers = { }
        let bytes = random(10000)
        expect(bytes).toHaveLength(10000)
        for (let byte of bytes) {
          if (!numbers[byte]) numbers[byte] = 0
          numbers[byte] += 1
          expect(typeof byte).toEqual('number')
          expect(byte).toBeLessThanOrEqual(255)
          expect(byte).toBeGreaterThanOrEqual(0)
        }
      })
    })
  })
}
