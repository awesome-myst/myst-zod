// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const inlineMathSchema = nodeSchema.extend({
  type: z.literal("inlineMath").describe("identifier for node variant"),
  value: z.string().describe("The text content of the inline math"),
}).describe("Fragment of math, similar to InlineCode, using role {math}");

export type InlineMath = z.infer<typeof inlineMathSchema>;
