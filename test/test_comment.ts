import { flowContentSchema } from "./src/flow-content/flow-content.ts";

// Test the comment node from your error
const commentNode = {
  type: "comment",
  value: "For chemicals you can use the {chem}`H2O`",
  position: {
    start: { line: 92, column: 1 },
    end: { line: 92, column: 1 },
  },
  key: "p5jlKKgFvc",
};

console.log("Testing comment node validation...");
try {
  const result = flowContentSchema.parse(commentNode);
  console.log("✅ Comment node validation successful!");
  console.log("Result:", result);
} catch (error) {
  console.log("❌ Comment node validation failed:");
  console.log(error);
}
