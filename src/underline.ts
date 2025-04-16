// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const underlineSchema = parentSchema.extend({
  type: z.literal("underline").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .describe("children of the underline node"),
}).describe(
  "Underline content, using role {underline}",
);

export type Underline = z.infer<typeof underlineSchema>;
