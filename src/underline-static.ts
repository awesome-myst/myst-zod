// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const underlineStaticSchema = parentSchema.extend({
  type: z.literal("underlineStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the underline node"),
}).describe(
  "Underline content, with static children; used when parent node requires static content.",
);

export type UnderlineStatic = z.infer<typeof underlineStaticSchema>;
