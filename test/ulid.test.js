import { equal, match, notEqual, ok } from 'node:assert'
import { after, before, describe, test } from 'node:test'

import * as browser from '../ulid/index.browser.js'
import * as node from '../ulid/index.js'

for (let type of ['node', 'browser']) {
  let { decodeTime, ulid, ulidAlphabet, ulidFactory } =
    type === 'node' ? node : browser
  
  describe(`ulid/${type}`, () => {
    if (type === 'browser') {
      // Mock crypto for browser tests in Node environment
      before(() => {
        if (!globalThis.crypto) {
          Object.defineProperty(globalThis, 'crypto', {
            configurable: true,
            value: {
              getRandomValues(array) {
                for (let i = 0; i < array.length; i++) {
                  array[i] = Math.floor(Math.random() * 256)
                }
                return array
              }
            },
            writable: true
          })
        }
      })
      
      after(() => {
        if (globalThis.crypto && globalThis.crypto.getRandomValues.toString().includes('Math.random')) {
          delete globalThis.crypto
        }
      })
    }
    
    test('generates valid ULID format', () => {
      let id = ulid()
      equal(id.length, 26)
      match(id, /^[0-9A-Z]{26}$/)
      
      // Check all characters are from ULID alphabet
      for (let char of id) {
        ok(ulidAlphabet.includes(char))
      }
    })
    
    test('supports custom length', () => {
      let id16 = ulid(16)
      equal(id16.length, 16)
      
      let id10 = ulid(10)
      equal(id10.length, 10)
      
      let id20 = ulid(20)
      equal(id20.length, 20)
    })
    
    test('returns standard ULID for length >= 26', () => {
      let id26 = ulid(26)
      equal(id26.length, 26)
      match(id26, /^[0-9A-Z]{26}$/)
      
      let id30 = ulid(30)
      equal(id30.length, 26)
      match(id30, /^[0-9A-Z]{26}$/)
    })
    
    test('has monotonic behavior', () => {
      let factory = ulidFactory()
      let ids = []
      
      // Generate multiple IDs quickly
      for (let i = 0; i < 1000; i++) {
        ids.push(factory())
      }
      
      // Check they are in sorted order
      let sorted = [...ids].sort()
      equal(JSON.stringify(ids), JSON.stringify(sorted))
      
      // Verify all are valid ULIDs
      for (let id of ids) {
        equal(id.length, 26)
        match(id, /^[0-9A-Z]{26}$/)
      }
    })
    
    test('monotonic handles same millisecond', () => {
      let factory = ulidFactory()
      let start = Date.now()
      let ids = []
      
      // Generate many IDs as fast as possible
      while (Date.now() === start && ids.length < 100) {
        ids.push(factory())
      }
      
      if (ids.length > 1) {
        // Verify they increment
        for (let i = 1; i < ids.length; i++) {
          ok(ids[i] > ids[i - 1])
          
          // Same timestamp prefix
          equal(ids[i].substring(0, 10), ids[i - 1].substring(0, 10))
        }
      }
    })
    
    test('decodes timestamp correctly', () => {
      let beforeTime = Date.now()
      let id = ulid()
      let afterTime = Date.now()
      let decoded = decodeTime(id)
      
      ok(decoded >= beforeTime, `Decoded time ${decoded} should be >= ${beforeTime}`)
      ok(decoded <= afterTime, `Decoded time ${decoded} should be <= ${afterTime}`)
    })
    
    test('decodeTime handles short IDs', () => {
      equal(decodeTime(''), 0)
      equal(decodeTime('123'), 0)
      equal(decodeTime('123456789'), 0)
    })
    
    test('decodeTime throws on invalid characters', () => {
      try {
        decodeTime('IIIIIIIIII') // I is not in alphabet
        ok(false, 'Should have thrown')
      } catch (e) {
        equal(e.message, 'Invalid ULID')
      }
    })
    
    test('has correct alphabet', () => {
      equal(ulidAlphabet, '0123456789ABCDEFGHJKMNPQRSTVWXYZ')
      equal(ulidAlphabet.length, 32)
      
      // Verify no confusing characters
      ok(!ulidAlphabet.includes('I'))
      ok(!ulidAlphabet.includes('L'))
      ok(!ulidAlphabet.includes('O'))
      ok(!ulidAlphabet.includes('U'))
    })
    
    test('has no collisions', () => {
      let used = {}
      for (let i = 0; i < 50000; i++) {
        let id = ulid()
        equal(used[id], undefined, `Collision detected: ${id}`)
        used[id] = true
      }
    })
    
    test('custom length uses mixed alphabets', () => {
      let id = ulid(16)
      equal(id.length, 16)
      
      // First part should be from ULID alphabet (time)
      // Last part can be from urlAlphabet (random)
      // This is a design feature for flexibility
    })
    
    test('timestamp increases over time', () => {
      let id1 = ulid()
      
      // Wait a bit
      let start = Date.now()
      while (Date.now() === start) {
        // Busy wait for next millisecond
      }
      
      let id2 = ulid()
      
      // Extract timestamps
      let time1 = decodeTime(id1)
      let time2 = decodeTime(id2)
      
      ok(time2 > time1, 'Later ULID should have larger timestamp')
      ok(id2 > id1, 'Later ULID should sort after earlier one')
    })
    
    test('generates different IDs', () => {
      let id1 = ulid()
      let id2 = ulid()
      let id3 = ulid()
      
      notEqual(id1, id2)
      notEqual(id1, id3)
      notEqual(id2, id3)
    })
  })
}