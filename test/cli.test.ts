import { assertMatch, assertStrictEquals } from "jsr:@std/assert@0.226";
import denoJson from "../deno.json" with { type: "json" };

async function nanoidCli(arg: string = "") {
  const args = arg.length > 0 ? arg.split(" ") : [];
  const command = new Deno.Command(Deno.execPath(), {
    cwd: import.meta.dirname,
    args: ["run", "../cli.ts", ...args],
  });
  const { success, stderr, stdout } = await command.output();
  return {
    success,
    stderr: new TextDecoder().decode(stderr),
    stdout: new TextDecoder().decode(stdout),
  };
}

Deno.test("CLI", async (t) => {
  await t.step("prints unique ID", async () => {
    const { stdout, success, stderr } = await nanoidCli();
    assertMatch(stdout, /^[\w-]{21}\n$/);
    assertStrictEquals(success, true);
    assertStrictEquals(stderr, "");
  });

  await t.step("uses size", async () => {
    const { stdout, success, stderr } = await nanoidCli("--size 10");
    assertMatch(stdout, /^[\w-]{10}\n$/);
    assertStrictEquals(success, true);
    assertStrictEquals(stderr, "");

    const { stdout: shortcut } = await nanoidCli("-s 10");
    assertMatch(shortcut, /^[\w-]{10}\n$/);
  });

  await t.step("uses alphabet", async () => {
    const { stdout, success, stderr } = await nanoidCli(
      "--alphabet abc --size 15",
    );
    assertMatch(stdout, /^[abc]{15}\n$/);
    assertStrictEquals(success, true);
    assertStrictEquals(stderr, "");

    const { stdout: shortcut } = await nanoidCli("-a abc -s 15");
    assertMatch(shortcut, /^[\w-]{15}\n$/);
  });

  await t.step("shows an error on unknown argument", async () => {
    const { stdout, success, stderr } = await nanoidCli("--cook");
    assertStrictEquals(stdout, "");
    assertStrictEquals(success, false);
    assertMatch(stderr, /.*unexpected argument '--cook'.*/);
  });

  await t.step("shows an error if size is not a number", async () => {
    const { stdout, success, stderr } = await nanoidCli("-s abc");
    assertStrictEquals(stdout, "");
    assertStrictEquals(success, false);
    assertMatch(stderr, /Invalid size: 'abc'. Please provide a valid number/);
  });

  await t.step("shows an error if size is a negative number", async () => {
    const { stdout, success, stderr } = await nanoidCli("-s=-1");
    assertStrictEquals(stdout, "");
    assertStrictEquals(success, false);
    assertMatch(stderr, /Invalid size: '-1'. Please provide a positive number/);
  });

  await t.step("displays help", async () => {
    const { stdout, success, stderr } = await nanoidCli("--help");
    assertMatch(stdout, /Show this help/);
    assertStrictEquals(success, true);
    assertStrictEquals(stderr, "");

    const { stdout: shortcut } = await nanoidCli("-h");
    assertMatch(shortcut, /Show this help/);
  });

  await t.step("displays the correct version", async () => {
    const re = new RegExp(denoJson.version);

    const { stdout, success, stderr } = await nanoidCli("--version");
    assertMatch(stdout, re);
    assertStrictEquals(success, true);
    assertStrictEquals(stderr, "");

    const { stdout: shortcut } = await nanoidCli("-V");
    assertMatch(shortcut, re);
  });
});
