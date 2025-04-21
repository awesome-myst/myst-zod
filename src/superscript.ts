// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Superscript = Parent & {
  type: "superscript";
  children?: PhrasingContent[];
};

export const superscriptSchema: ZodType<Superscript> = parentSchema.extend({
  type: z.literal("superscript").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("children of the superscript node"),
}).describe(
  "Superscript content, using role {superscript}",
);
