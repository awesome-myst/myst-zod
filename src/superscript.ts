// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const superscriptSchema = parentSchema.extend({
  type: z.literal("superscript").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .describe("children of the superscript node"),
}).describe(
  "Superscript content, using role {superscript}",
);

export type Superscript = z.infer<typeof superscriptSchema>;
