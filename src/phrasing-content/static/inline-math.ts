// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "../../node.ts";

export type InlineMath = Node & {
  type: "inlineMath";
  value: string;
};

export const inlineMathSchema: ZodType<InlineMath> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("inlineMath").describe("identifier for node variant"),
    value: z.string().describe("The text content of the inline math"),
  })
  .describe("Fragment of math, similar to InlineCode, using role {math}");
