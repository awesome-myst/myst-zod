// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const blockBreakSchema = nodeSchema
  .extend({
    type: z.literal("blockBreak").describe("identifier for node variant"),
    meta: z
      .string()
      .optional()
      .describe(
        "Block metadata. Conventionally this is a stringified JSON dictionary but it may be any arbitrary string.",
      ),
    position: z.any().optional(),
    data: z.any().optional(),
  })
  .describe("Top-level break in the myst document, breaking it into Blocks");

export type BlockBreak = z.infer<typeof blockBreakSchema>;
