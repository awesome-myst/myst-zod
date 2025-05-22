// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "../node.ts";

export type ThematicBreak = Node & {
  type: "thematicBreak";
};

export const thematicBreakSchema: ZodType<ThematicBreak> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("thematicBreak").describe("identifier for node variant"),
  })
  .describe("Thematic break");
