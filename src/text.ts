// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Text = Node & {
  type: "text";
  value: string;
};

export const textSchema: ZodType<Text> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("text").describe("identifier for node variant"),
    value: z.string().describe("text content of the text node"),
  })
  .describe("A text node");
