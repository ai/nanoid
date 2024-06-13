#!/usr/bin/env -S deno run

// Copyright 2024 Quadratz <quadratz@proton.me>. All rights reserved. MIT license.

import { customAlphabet, nanoid } from "../mod.ts";
import { parseArgs } from "jsr:@std/cli@0.224.6/parse-args";
import { blue, bold, green, red, yellow } from "jsr:@std/fmt@0.225.4/colors";
import denoJson from "../deno.json" with { type: "json" };

const flags = parseArgs(Deno.args, {
  boolean: ["help", "version"],
  string: ["alphabet", "size"],
  unknown: unknownArgs,
  alias: { help: "h", version: "V", alphabet: "a", size: "s" },
});

function unknownArgs(args: string) {
  console.error(
    `${
      bold(red("error"))
    }: unexpected argument '${args}' found\n\nFor more information, try '--help'.\n`,
  );
  Deno.exit(2);
}

const VERSION = denoJson.version;
const HELP_OUTPUT = `${yellow("Nano ID Deno")}

A tiny, secure, URL-friendly, unique string ID generator for Deno.

Doc: https://github.com/quadratz/nanoid-deno
Module: https://jsr.io/@qz/nanoid-deno

${yellow("Version:")}
  ${green(`nanoid-deno ${VERSION}`)}

${yellow("Usage:")}
  ${green("deno run jsr:@qz/nanoid-deno/cli [OPTIONS]")}

${yellow("Options:")}
  ${green("-s")}, ${green("--size")}       Generated ID size
  ${green("-a")}, ${green("--alphabet")}   Alphabet to use
  ${green("-h")}, ${green("--help")}       Show this help
  ${green("-V")}, ${green("--version")}    Show version

${yellow("Examples:")}
  ${blue("deno run jsr:@qz/nanoid-deno/cli")}
  Uakgb_J5m9g-0JDMbcJqL

  ${blue("deno run jsr:@qz/nanoid-deno/cli --size 5")}
  2ZBBi

  ${blue("deno run jsr:@qz/nanoid-deno/cli --size 10 --alphabet abc")}
  bcabababca`;

switch (true) {
  case flags.help:
    console.log(HELP_OUTPUT);
    Deno.exit(0);
    break;

  case flags.version:
    console.log(`nanoid-deno ${VERSION}`);
    Deno.exit(0);
    break;
}

const nanErrMsg = `${
  bold(red("error"))
}: Invalid size: '${flags.size}'. Please provide a valid number for the ID size.
\nFor more information, try '--help'.\n`;

if (flags.size && flags.size.length === 0) {
  console.error(nanErrMsg);
  Deno.exit(2);
}

const size = (flags.size) ? Number(flags.size) : undefined;

if (size !== undefined) {
  if (isNaN(size)) {
    console.error(nanErrMsg);
    Deno.exit(2);
  }

  if (size < 0) {
    const msg = `${
      bold(red("error"))
    }: Invalid size: '${flags.size}'. Please provide a positive number for the ID size.
    \nFor more information, try '--help'.\n`;

    console.error(msg);
    Deno.exit(2);
  }
}

if (flags.alphabet) {
  const customNanoid = customAlphabet(flags.alphabet, size);
  console.log(customNanoid());
} else {
  console.log(nanoid(size));
}

Deno.exit(0);
