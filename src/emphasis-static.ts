// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const emphasisStaticSchema = parentSchema
  .extend({
    type: z.literal("emphasisStatic").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .describe("static children of the emphasis node"),
  })
  .describe(
    "Stressed, italicized content, with static children; used when parent node requires static content",
  );

export type EmphasisStatic = z.infer<typeof emphasisStaticSchema>;
