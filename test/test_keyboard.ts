import { phrasingContentSchema } from "./src/phrasing-content/phrasing-content.ts";

// Test the keyboard node from your error
const keyboardNode = {
  type: "keyboard",
  children: [
    {
      type: "text",
      value: "Ctrl",
      key: "WgniKr8PCk",
    },
  ],
  key: "o9D0r8ZfK4",
};

console.log("Testing keyboard node validation...");
try {
  const result = phrasingContentSchema.parse(keyboardNode);
  console.log("✅ Keyboard node validation successful!");
  console.log("Result:", result);
} catch (error) {
  console.log("❌ Keyboard node validation failed:");
  console.log(error);
}
