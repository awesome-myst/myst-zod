import { definitionListSchema } from "./src/flow-content/definition-list.ts";

// Test definition list data from the JSON
const testDefinitionList = {
  type: "definitionList",
  position: {
    start: {
      line: 30,
      column: 1,
    },
    end: {
      line: 39,
      column: 1,
    },
  },
  children: [
    {
      type: "definitionTerm",
      position: {
        start: {
          line: 30,
          column: 1,
        },
        end: {
          line: 29,
          column: 1,
        },
      },
      children: [
        {
          type: "text",
          value: "strikethrough",
          position: {
            start: {
              line: 30,
              column: 1,
            },
            end: {
              line: 30,
              column: 1,
            },
          },
          key: "ZXNRr0dC8N",
        },
      ],
      key: "yNNSVYfsZA",
    },
    {
      type: "definitionDescription",
      position: {
        start: {
          line: 31,
          column: 1,
        },
        end: {
          line: 32,
          column: 1,
        },
      },
      children: [
        {
          type: "text",
          value: "Use the ",
          position: {
            start: {
              line: 31,
              column: 1,
            },
            end: {
              line: 31,
              column: 1,
            },
          },
          key: "kYLGeRO6JZ",
        },
        {
          type: "inlineCode",
          value: "del",
          position: {
            start: {
              line: 31,
              column: 1,
            },
            end: {
              line: 31,
              column: 1,
            },
          },
          key: "TJp1KPzXHY",
        },
      ],
      key: "Rwuw5DBpAu",
    },
  ],
  key: "UjcM0iNhDL",
};

console.log("Testing definition list validation...");

try {
  const result = definitionListSchema.parse(testDefinitionList);
  console.log("✅ Definition list validation successful");
  console.log("Type:", result.type);
  console.log("Children count:", result.children?.length);
  console.log("First child type:", result.children?.[0]?.type);
} catch (error) {
  console.log("❌ Definition list validation failed:", error);
}
