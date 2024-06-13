import { assertStrictEquals } from "jsr:@std/assert@0.226";
import denoJson from "../deno.json" with { type: "json" };

Deno.test("changelog for current version should be documented", async () => {
  const content = await Deno.readTextFile(
    `${import.meta.dirname}/../CHANGELOG.md`,
  );

  if (denoJson.version.includes("-")) {
    return assertStrictEquals(true, true);
  }

  assertStrictEquals(content.includes(`## ${denoJson.version}`), true);
});
