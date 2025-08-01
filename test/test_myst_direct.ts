import { mystSchema } from "./src/flow-content/myst.ts";
import { flowContentSchema } from "./src/flow-content/flow-content.ts";

// Test the myst schema directly
const testMystNode = {
  type: "myst",
  value:
    "- Lists can start with `-` or `*`\n  * My other, nested\n  * bullet point list!\n\n1. My numbered list\n2. has two points",
  key: "q0TSP6JjSX",
};

console.log("Testing myst schema directly...");

try {
  const result = mystSchema.parse(testMystNode);
  console.log("✅ Myst node validation successful");
  console.log("Type:", result.type);
  console.log("Value length:", result.value.length);
  console.log("Key:", result.key);
} catch (error) {
  console.log("❌ Myst node validation failed:", error);
}

// Test that myst node can be parsed as flow content
console.log("\nTesting myst as flow content...");

try {
  const result = flowContentSchema.parse(testMystNode);
  console.log("✅ Myst node validates as flow content");
  console.log("Type:", result.type);
} catch (error) {
  console.log("❌ Myst node as flow content failed:", error);
}
