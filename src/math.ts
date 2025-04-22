// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Math = Node & {
  type: "math";
  enumerated?: boolean;
  enumerator?: string;
  identifier?: string;
  label?: string;
  value: string;
};

export const mathSchema: ZodType<Math> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("math").describe("identifier for node variant"),
    enumerated: z
      .boolean()
      .optional()
      .describe(
        "count this math block for numbering based on kind, e.g. See equation (1a)",
      ),
    enumerator: z
      .string()
      .optional()
      .describe("resolved enumerated value for this math block"),
    identifier: z
      .string()
      .optional()
      .describe(
        "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
      ),
    label: z
      .string()
      .optional()
      .describe(
        "node label; character escapes and references are parsed; may be normalized to a unique identifier",
      ),
    value: z.string().describe("The value of the math node"),
  })
  .describe("Math node for presenting numbered equations");
