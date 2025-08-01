import { flowContentSchema } from "./src/flow-content/flow-content.ts";

// Test the footnote definition from your error
const footnoteNode = {
  "type": "footnoteDefinition",
  "identifier": "1",
  "label": "1",
  "children": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Sometimes, you need to explain a point",
          "key": "Kq7kEiouEG",
        },
      ],
      "key": "ORyvePRIyo",
    },
    {
      "type": "image",
      "url": "/e18f93c1a505d76c1d42cf6b874a6a0d.png",
      "alt": "Mountains!",
      "key": "lXc9QLdUCm",
    },
  ],
  "key": "M9jcOesEv0",
};

console.log("Testing footnote definition with image...");
try {
  const result = flowContentSchema.parse(footnoteNode);
  console.log("✅ Footnote definition with image validation successful!");
  console.log("Result type:", result.type);
} catch (error) {
  console.log("❌ Footnote definition with image validation failed:");
  console.log(error);
}
