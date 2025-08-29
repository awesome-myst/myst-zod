// SPDX-License-Identifier: MIT

// Test file to verify social links functionality in affiliations
import { affiliationSchema } from "./src/frontmatter/affiliations.ts";

// Test basic affiliation with social links
const testAffiliation1 = {
  name: "Example University",
  github: "exampleuni",
  twitter: "example_uni",
  url: "https://example.edu",
};

// Test with aliases
const testAffiliation2 = {
  name: "Test Institution",
  bsky: "@test.bsky.social", // alias for bluesky
  x: "test_twitter", // alias for twitter
  website: "https://test.org", // alias for url
  instagram: "test_insta", // alias for threads
};

// Test duplicate key detection
const testAffiliation3 = {
  name: "Duplicate Test",
  twitter: "test1",
  x: "test2", // This should cause an error as it's an alias for twitter
};

console.log("Testing social links in affiliations...");

try {
  const result1 = affiliationSchema.parse(testAffiliation1);
  console.log("✓ Basic social links test passed:", result1);
} catch (error) {
  console.error("✗ Basic social links test failed:", error);
}

try {
  const result2 = affiliationSchema.parse(testAffiliation2);
  console.log("✓ Social links aliases test passed:", result2);
} catch (error) {
  console.error("✗ Social links aliases test failed:", error);
}

try {
  const result3 = affiliationSchema.parse(testAffiliation3);
  console.error("✗ Duplicate key test should have failed but passed:", result3);
} catch (error: unknown) {
  console.log(
    "✓ Duplicate key test correctly failed:",
    (error as { issues?: Array<{ message: string }> }).issues?.[0]?.message,
  );
}

console.log("All tests completed!");
