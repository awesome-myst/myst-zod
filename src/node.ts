// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type Node = {
  type: string;
  data?: Record<string, unknown>;
  position?: {
    start: {
      line: number;
      column: number;
      offset?: number;
    };
    end: {
      line: number;
      column: number;
      offset?: number;
    };
    indent?: number[];
  };
};

export const nodeSchema: ZodType<Node> = z
  .object({
    type: z.string().describe("identifier for node variant"),
    data: z
      .record(z.any())
      .optional()
      .describe(
        "information associated by the ecosystem with the node; never specified by mdast",
      ),
    position: z
      .object({
        start: z
          .object({
            line: z.number().describe("line in the source file, 1-indexed"),
            column: z.number().describe("column in the source file, 1-indexed"),
            offset: z
              .number()
              .optional()
              .describe("offset character in the source file, 0-indexed"),
          })
          .describe("place of first character of parsed source region"),
        end: z
          .object({
            line: z.number().describe("line in the source file, 1-indexed"),
            column: z.number().describe("column in the source file, 1-indexed"),
            offset: z
              .number()
              .optional()
              .describe("offset character in the source file, 0-indexed"),
          })
          .describe("place of first character after parsed source region"),
        indent: z
          .array(z.number())
          .optional()
          .describe(
            "start column at each index in the source region, for elements that span multiple lines",
          ),
      })
      .optional()
      .describe(
        "location of node in source file; must not be present for generated nodes",
      ),
  })
  .describe(
    "Base node object, based on the [unist](https://github.com/syntax-tree/unist) syntax tree.",
  );
