import { tocSchema } from "../src/toc.ts";

import { assert, assertEquals } from "jsr:@std/assert@1";

Deno.test("Single file entry passes", () => {
  const input = [{ file: "foo.md" }];
  const result = tocSchema.safeParse(input);
  assert(result.success);
  assertEquals(result.data, input);
});

for (
  const [kind, value] of [
    ["file", "foo.md"],
    ["url", "https://google.com"],
    ["pattern", "main*.md"],
  ] as const
) {
  Deno.test(`Single ${kind} entry with title passes`, () => {
    const entry = { [kind]: value, title: "document" };
    const input = [entry];
    const result = tocSchema.safeParse(input);
    assert(result.success);
    assertEquals(result.data, input as unknown as typeof result.data);
  });

  Deno.test(`Single ${kind} entry with invalid title fails`, () => {
    const bad = { [kind]: value, title: 1000 };
    const { success } = tocSchema.safeParse([bad]);
    assert(!success);
  });
}

Deno.test("Single file entry with children passes", () => {
  const input = [{ file: "foo.md", children: [{ file: "bar.md" }] }];
  const result = tocSchema.safeParse(input);
  assert(result.success);
  assertEquals(result.data, input);
});

Deno.test("Single file entry with invalid children fails", () => {
  const input = [{ file: "foo.md", children: [{ utopia: "bar.md" }] }];
  const { success } = tocSchema.safeParse(input);
  assert(!success);
});

Deno.test("Single parent entry passes", () => {
  const input = [{ title: "Bar", children: [] }];
  const result = tocSchema.safeParse(input);
  assert(result.success);
  assertEquals(result.data, input);
});

Deno.test("Single parent entry with children passes", () => {
  const input = [{
    title: "Bar",
    children: [{ url: "https://bbc.co.uk/news" }],
  }];
  const result = tocSchema.safeParse(input);
  assert(result.success);
  assertEquals(result.data, input);
});

Deno.test("Single parent entry without title fails", () => {
  const input = [{ children: [{ url: "https://bbc.co.uk/news" }] }];
  const { success } = tocSchema.safeParse(input);
  assert(!success);
});

Deno.test("invalid toc entry", () => {
  const input = ["invalid"];
  const { success } = tocSchema.safeParse(input);
  assert(!success);
});
