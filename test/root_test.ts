// SPDX-License-Identifier: MIT

import { assertEquals } from "jsr:@std/assert@1";

import { rootSchema } from "../src/root.ts";

Deno.test("Root schema test", () => {
  const validRoot = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "Hello, world!" }],
      },
    ],
  };

  const invalidRoot = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: 123 },
          { type: "text", value: true },
        ],
      },
    ],
  };

  assertEquals(rootSchema.safeParse(validRoot).success, true);
  assertEquals(rootSchema.safeParse(invalidRoot).success, false);
});

interface MystTest {
  title: string;
  mdast: object;
  myst: string;
}

const allTests: MystTest[] = JSON.parse(
  Deno.readTextFileSync(new URL("./myst.tests.json", import.meta.url)),
);

for (const testCase of allTests) {
  Deno.test(`Test for – ${testCase.title}`, () => {
    const result = rootSchema.safeParse(testCase.mdast);
    if (!result.success) {
      console.error(result.error.format());
    }
    assertEquals(result.success, true);
  });
}
