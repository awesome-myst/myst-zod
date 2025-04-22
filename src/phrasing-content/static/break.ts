// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "../../node.ts";

export type Break = Node & {
  type: "break";
};

export const breakSchema: ZodType<Break> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("break").describe("identifier for node variant"),
  })
  .describe("Line break");
