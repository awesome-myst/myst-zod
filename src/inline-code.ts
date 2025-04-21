// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type InlineCode = Node & {
  type: "inlineCode";
  value: string;
};

export const inlineCodeSchema = nodeSchema
  .extend({
    type: z.literal("inlineCode").describe("identifier for node variant"),
    value: z.string().describe("The text content of the inline code"),
  })
  .describe("Fragment of code");
