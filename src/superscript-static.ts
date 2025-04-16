// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const superscriptStaticSchema = parentSchema.extend({
  type: z.literal("superscriptStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the superscript node"),
}).describe(
  "Superscripted content, with static children; used when parent node requires static content.",
);

export type SuperscriptStatic = z.infer<typeof superscriptStaticSchema>;
