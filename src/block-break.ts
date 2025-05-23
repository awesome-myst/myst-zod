// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "./node.ts";

export type BlockBreak = Node & {
  type: "blockBreak";
  meta?: string;
};

export const blockBreakSchema: ZodType<BlockBreak> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("blockBreak").describe("identifier for node variant"),
    meta: z
      .string()
      .optional()
      .describe(
        "Block metadata. Conventionally this is a stringified JSON dictionary but it may be any arbitrary string.",
      ),
  })
  .describe("Top-level break in the myst document, breaking it into Blocks");
