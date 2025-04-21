// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Underline = Parent & {
  type: "underline";
  children: PhrasingContent[];
};

export const underlineSchema: ZodType<Parent> = parentSchema.extend({
  type: z.literal("underline").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("children of the underline node"),
}).describe(
  "Underline content, using role {underline}",
);
