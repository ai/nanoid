// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

import {
  assertIsError,
  assertMatch,
  assertStrictEquals,
} from "jsr:@std/assert@0.226";
import { customAlphabet, nanoid } from "../non_secure.ts";
import { urlAlphabet } from "../mod.ts";

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
