// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

import {
  assertIsError,
  assertMatch,
  assertNotEquals,
  assertStrictEquals,
} from "jsr:@std/assert@0.226";
import {
  customAlphabet,
  customRandom,
  nanoid,
  random,
  urlAlphabet,
} from "../mod.ts";

Deno.test("nanoid", async (t) => {
  await t.step("generates URL-friendly IDs", () => {
    for (let i = 0; i < 100; i++) {
      const id = nanoid();
      assertStrictEquals(id.length, 21);
      assertStrictEquals(typeof id, "string");

      for (const char of id) {
        assertMatch(urlAlphabet, new RegExp(char, "g"));
      }
    }
  });

  await t.step("changes ID length", () => {
    assertStrictEquals(nanoid(10).length, 10);
  });

  await t.step("has no collisions", () => {
    const used: Record<string, boolean> = {};
    for (let i = 0; i < 50_000; i++) {
      const id = nanoid();
      assertStrictEquals(used[id], undefined);
      used[id] = true;
    }
  });

  await t.step("has flat distribution", () => {
    const COUNT = 100_000;
    const LENGTH = nanoid().length;

    const chars: Record<string, number> = {};
    for (let i = 0; i < COUNT; i++) {
      const id = nanoid();
      for (const char of id) {
        if (chars[char]) chars[char] = 0;
        chars[char] += 1;
      }
    }
    assertStrictEquals(Object.keys(chars).length, urlAlphabet.length);

    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    for (const k in chars) {
      const distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH);
      if (distribution > max) max = distribution;
      if (distribution < min) min = distribution;
    }
    assertStrictEquals(max - min <= 0.05, true);
  });

  await t.step("throw an error for 'NaN' size", () => {
    let err: Error | undefined;
    try {
      nanoid(NaN);
    } catch (error) {
      err = error;
    } finally {
      assertIsError(err, Deno.errors.InvalidData, "NaN");
    }
  });
});

Deno.test("customAlphabet", async (t) => {
  await t.step("has options", () => {
    const nanoid = customAlphabet("a", 5);
    assertStrictEquals(nanoid(), "aaaaa");
  });

  await t.step("has flat distribution", () => {
    const COUNT = 50_000;
    const LENGTH = 30;
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    const nanoid = customAlphabet(ALPHABET, LENGTH);

    const chars: Record<string, number> = {};
    for (let i = 0; i < COUNT; i++) {
      const id = nanoid();
      for (const char of id) {
        if (!chars[char]) chars[char] = 0;
        chars[char] += 1;
      }
    }

    assertStrictEquals(Object.keys(chars).length, ALPHABET.length);

    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    for (const k in chars) {
      const distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH);
      if (distribution > max) max = distribution;
      if (distribution < min) min = distribution;
    }
    assertStrictEquals(max - min <= 0.05, true);
  });

  await t.step("changes size", () => {
    const nanoid = customAlphabet("a");
    assertStrictEquals(nanoid(10), "aaaaaaaaaa");
  });

  await t.step("throw an error for 'NaN' size", () => {
    let err: Error | undefined;
    try {
      customAlphabet("a", NaN);
    } catch (error) {
      err = error;
    } finally {
      assertIsError(err, Deno.errors.InvalidData, "NaN");
    }
  });
});

Deno.test("customRandom", async (t) => {
  await t.step("supports generator", () => {
    const sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1];

    function fakeRandom(size: number) {
      let bytes: Array<number> = [];
      for (let i = 0; i < size; i += sequence.length) {
        bytes = bytes.concat(sequence.slice(0, size - i));
      }
      return bytes as unknown as Uint8Array;
    }

    const nanoid4 = customRandom("abcde", 4, fakeRandom);
    const nanoid18 = customRandom("abcde", 18, fakeRandom);

    assertStrictEquals(nanoid4(), "adca");
    assertStrictEquals(nanoid18(), "cbadcbadcbadcbadcc");
  });
});

Deno.test("urlAlphabet", async (t) => {
  await t.step("is string", () => {
    assertStrictEquals(typeof urlAlphabet, "string");
  });

  await t.step("has no duplicates", () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      assertStrictEquals(urlAlphabet.lastIndexOf(urlAlphabet[i]), i);
    }
  });
});

Deno.test("random", async (t) => {
  await t.step("generates small random buffers", () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      assertStrictEquals(random(10).length, 10);
    }
  });

  await t.step("generates random buffers", () => {
    const numbers: Record<number, number> = {};

    const bytes: Uint8Array = random(1000);
    assertStrictEquals(bytes.length, 1000);

    for (const byte of bytes) {
      if (!numbers[byte]) {
        numbers[byte] = 0;
      }

      numbers[byte] += 1;

      assertStrictEquals(typeof byte, "number");
      assertStrictEquals(byte <= 255, true);
      assertStrictEquals(byte >= 0, true);
    }
  });

  await t.step("throw an error for 'NaN' size", () => {
    let err: Error | undefined;
    try {
      random(NaN);
    } catch (error) {
      err = error;
    } finally {
      assertIsError(err, Deno.errors.InvalidData, "NaN");
    }
  });
});

Deno.test("proxy number", async (t) => {
  await t.step("prevent collision", () => {
    const makeProxyNumberToReproducePreviousID = () => {
      let step = 0;
      return {
        valueOf() {
          // "if (!pool || pool.length < bytes) {"
          if (step === 0) {
            step++;
            return 0;
          }
          // "} else if (poolOffset + bytes > pool.length) {"
          if (step === 1) {
            step++;
            return -Infinity;
          }
          // "poolOffset += bytes"
          if (step === 2) {
            step++;
            return 0;
          }

          return 21;
        },
      };
    };

    const id1 = nanoid();
    // @ts-ignore testing the misuse of `valueOf`
    const id2 = nanoid(makeProxyNumberToReproducePreviousID());

    assertNotEquals(id1, id2);
  });
});
