// SPDX-License-Identifier: MIT

import { assertEquals } from "jsr:@std/assert@1";
import { xrefReferenceSchema, xrefSchema } from "../src/myst-xref.ts";

// Test individual XRefReference items
Deno.test("XRefReference Schema - valid references", () => {
  const validReferences = [
    {
      // Heading requires identifier
      kind: "heading",
      identifier: "test-heading",
      data: "/path/to/data.json",
      url: "/path/to/page",
    },
    {
      // Page doesn't require identifier
      kind: "page",
      data: "/index.json",
      url: "/",
    },
    {
      // With optional fields
      kind: "figure",
      identifier: "fig-1",
      html_id: "figure-1",
      data: "/path/to/data.json",
      url: "/path/to/page",
      implicit: true,
    },
  ];

  for (const ref of validReferences) {
    const result = xrefReferenceSchema.safeParse(ref);
    assertEquals(
      result.success,
      true,
      `Failed to parse: ${JSON.stringify(ref)}`,
    );
  }
});

Deno.test("XRefReference Schema - invalid references", () => {
  const invalidReferences = [
    {
      // Missing identifier for non-page kind
      kind: "heading",
      data: "/path/to/data.json",
      url: "/path/to/page",
    },
    {
      // Missing required fields
      kind: "figure",
      identifier: "fig-1",
    },
  ];

  for (const ref of invalidReferences) {
    const result = xrefReferenceSchema.safeParse(ref);
    assertEquals(
      result.success,
      false,
      `Should have failed to parse: ${JSON.stringify(ref)}`,
    );
  }
});

// Test full XRef objects from test files
Deno.test("XRef Schema - test files", async () => {
  // Get all JSON test files
  const testDir = new URL("./xref/test-cases/", import.meta.url);

  try {
    // Read directory entries
    const entries = Array.from(Deno.readDirSync(testDir)).filter(
      (entry) => entry.isFile && entry.name.endsWith(".json"),
    );

    // If no test files found, fail the test
    if (entries.length === 0) {
      throw new Error(`No .json test files found in ${testDir}`);
    }

    // Test each file
    for (const entry of entries) {
      const filePath = new URL(
        `./xref/test-cases/${entry.name}`,
        import.meta.url,
      );
      const content = await Deno.readTextFile(filePath);
      const data = JSON.parse(content);

      const result = xrefSchema.safeParse(data);
      assertEquals(
        result.success,
        true,
        `Failed to parse ${entry.name}: ${
          result.success ? "" : JSON.stringify(result.error.format())
        }`,
      );

      if (result.success) {
        // Compare the parsed data with original data
        // We're doing a deep equality check on the original data and parsed result
        assertEquals(
          result.data,
          data,
          `Output doesn't match input for ${entry.name}`,
        );
      }
    }
  } catch (error) {
    // Handle case where directory doesn't exist yet
    if (error instanceof Deno.errors.NotFound) {
      console.warn(
        `Test directory not found: ${testDir}. Create it with test files to run tests.`,
      );
    } else {
      throw error;
    }
  }
});
