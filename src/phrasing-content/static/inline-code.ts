// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "../../node.ts";

export type InlineCode = Node & {
  type: "inlineCode";
  value: string;
};

export const inlineCodeSchema: ZodType<InlineCode> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("inlineCode").describe("identifier for node variant"),
    value: z.string().describe("The text content of the inline code"),
  })
  .describe("Fragment of code");
