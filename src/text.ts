// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const textSchema = nodeSchema.extend({
  type: z.literal("text").describe("identifier for node variant"),
  value: z.string().describe("text content of the text node"),
}).describe("A text node");

export type Text = z.infer<typeof textSchema>;
