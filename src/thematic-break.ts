// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const thematicBreakSchema = nodeSchema.extend({
  type: z.literal("thematicBreak").describe("identifier for node variant"),
}).describe("Thematic break");

export type ThematicBreak = z.infer<typeof thematicBreakSchema>;
