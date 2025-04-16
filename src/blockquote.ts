// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";

export const blockquoteSchema = parentSchema.extend({
  type: z.literal("blockquote").describe("identifier for node variant"),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("content of the block quote"),
}).describe("Block quote");

export type Blockquote = z.infer<typeof blockquoteSchema>;
