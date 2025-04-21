// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export interface EmphasisStatic extends z.infer<typeof parentSchema> {
  type: "emphasisStatic";
  children: StaticPhrasingContent[];
}

export const emphasisStaticSchema: ZodType<EmphasisStatic> = parentSchema
  .extend({
    type: z.literal("emphasisStatic").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .describe("static children of the emphasis node"),
  })
  .describe(
    "Stressed, italicized content, with static children; used when parent node requires static content",
  );