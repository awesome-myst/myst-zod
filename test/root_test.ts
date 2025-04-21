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
        children: [{ type: "text", value: 123 }, { type: "text", value: true }],
      },
    ],
  };

  assertEquals(rootSchema.safeParse(validRoot).success, true);
  assertEquals(rootSchema.safeParse(invalidRoot).success, false);
});
