// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Text = Node & {
  type: "text";
  value: string;
};

export const textSchema = nodeSchema
  .extend({
    type: z.literal("text").describe("identifier for node variant"),
    value: z.string().describe("text content of the text node"),
  })
  .describe("A text node");
