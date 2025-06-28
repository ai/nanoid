# ULID API Documentation

## Overview

Nano ID's ULID support provides Universally Unique Lexicographically Sortable Identifiers that combine timestamps with randomness to create time-sortable unique IDs.

## Import

```js
// ESM
import { ulid, ulidFactory, decodeTime, ulidAlphabet } from 'nanoid/ulid'

// CommonJS
const { ulid, ulidFactory, decodeTime, ulidAlphabet } = require('nanoid/ulid')
```

## API Reference

### `ulid(len?)`

Generates a ULID (Universally Unique Lexicographically Sortable Identifier).

```js
ulid() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAV"
```

#### Parameters

- `len` (optional): Number - Custom length for the ID
  - If `len < 26`: Returns a custom-length time-prefixed ID
  - If `len >= 26` or omitted: Returns standard 26-character ULID

#### Examples

```js
// Standard ULID (26 characters)
ulid() //=> "01ARZ3NDEKTSV4RRFFQ69G5FAV"

// Custom length (16 characters)
ulid(16) //=> "01ARZ3ND12345678"

// Custom length (10 characters)  
ulid(10) //=> "01ARZ3ND12"
```

### `ulidFactory()`

Creates a monotonic ULID factory that guarantees sortability within the same millisecond.

```js
const monotonic = ulidFactory()
monotonic() //=> "01BXAVRG61YJ5YSBRM51702F6M"
monotonic() //=> "01BXAVRG61YJ5YSBRM51702F6N"
```

#### Returns

A function that generates monotonic ULIDs. When called multiple times within the same millisecond, the random component increments to maintain sort order.

#### Example

```js
const factory = ulidFactory()
const ids = []

// Generate 5 IDs quickly
for (let i = 0; i < 5; i++) {
  ids.push(factory())
}

// All IDs will be in sorted order
console.log(ids.sort() === ids) // true
```

### `decodeTime(id)`

Extracts the timestamp from a ULID.

```js
const id = ulid()
const timestamp = decodeTime(id)
console.log(new Date(timestamp)) // Creation time
```

#### Parameters

- `id`: String - The ULID to decode

#### Returns

Number - Milliseconds since Unix epoch

#### Errors

- Throws `Error('Invalid ULID')` if the ID contains invalid characters

#### Example

```js
const id = "01ARZ3NDEKTSV4RRFFQ69G5FAV"
const ms = decodeTime(id)
console.log(ms) // 1469918176385
console.log(new Date(ms)) // 2016-07-30T22:36:16.385Z
```

### `ulidAlphabet`

The Crockford's Base32 alphabet used by ULID.

```js
console.log(ulidAlphabet) 
//=> "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
```

This alphabet excludes `I`, `L`, `O`, and `U` to avoid confusion.

## ULID Format

A ULID is a 128-bit identifier with two components:

```
01AN4Z07BY     79KA1307SR9X4MV3
|----------|   |----------------|
 Timestamp        Randomness
 (48 bits)        (80 bits)
 10 chars         16 chars
```

- **Timestamp**: 48-bit integer of Unix time in milliseconds
- **Randomness**: 80 bits of cryptographically secure random data

## Use Cases

### When to Use ULID

- **Time-series data**: Events, logs, or records that benefit from chronological ordering
- **Database primary keys**: Sequential insertion reduces index fragmentation
- **Distributed systems**: No coordination needed between nodes
- **Event sourcing**: Natural event ordering without separate timestamp columns

### When NOT to Use ULID

- **Security tokens**: Timestamp exposure is a privacy concern
- **Session IDs**: Only 80 bits of randomness (vs 126 for nanoid)
- **User-facing IDs**: Timestamps reveal creation time
- **High-frequency generation**: Monotonic increment can be predictable

## Performance

- **Generation speed**: 2-5M ops/sec (Node.js), 1-3M ops/sec (browser)
- **Size overhead**: ~1KB added to bundle
- **Memory efficient**: Uses pooling in Node.js for better performance

## Security Considerations

⚠️ **Important Security Notes:**

1. **Timestamp Exposure**: The first 48 bits reveal when the ID was created
2. **Reduced Entropy**: 80 bits of randomness vs nanoid's 126 bits
3. **Predictable Increment**: Monotonic ULIDs increment sequentially within same millisecond
4. **Not for Secrets**: Never use ULIDs for passwords, tokens, or security-critical identifiers

## Comparison

| Feature | ULID | NanoID |
|---------|------|--------|
| Size | 26 chars | 21 chars (default) |
| Entropy | 80 bits | 126 bits |
| Sortable | Yes (by time) | No |
| Timestamp | Exposed | No |
| Bundle size | ~1KB | 118B |
| Use case | Time-series | General purpose |

## Examples

### Basic Usage

```js
import { ulid } from 'nanoid/ulid'

// Generate IDs for events
const event1 = { id: ulid(), type: 'click' }
const event2 = { id: ulid(), type: 'submit' }

// IDs are sortable by creation time
console.log(event1.id < event2.id) // true
```

### Database Usage

```js
import { ulid } from 'nanoid/ulid'

// Using ULID as primary key
const user = {
  id: ulid(),
  name: 'Alice',
  created_at: new Date()
}

// No need for separate timestamp - it's in the ID!
const created = new Date(decodeTime(user.id))
```

### Monotonic Generation

```js
import { ulidFactory } from 'nanoid/ulid'

const generator = ulidFactory()

// Batch insert with guaranteed order
const records = data.map(item => ({
  id: generator(),
  ...item
}))

// Records maintain insertion order even if created in same millisecond
await db.batchInsert(records)
```

### Custom Length IDs

```js
import { ulid } from 'nanoid/ulid'

// Shorter IDs for less critical use cases
const shortId = ulid(12) //=> "01ARZ3ND1234"

// Still time-prefixed but with less randomness
const sessionId = ulid(16) //=> "01ARZ3ND12345678"
```

## CLI Usage

```bash
# Generate a ULID
nanoid --ulid

# Generate ULID with custom length
nanoid --ulid --size 16

# ULID doesn't support custom alphabets
nanoid --ulid --alphabet "abc" # Error!
```