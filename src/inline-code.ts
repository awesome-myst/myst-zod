// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const inlineCodeSchema = nodeSchema.extend({
  type: z.literal("inlineCode").describe("identifier for node variant"),
  value: z.string().describe("The text content of the inline code"),
}).describe("Fragment of code");

export type InlineCode = z.infer<typeof inlineCodeSchema>;
