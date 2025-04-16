// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const subscriptStaticSchema = parentSchema.extend({
  type: z.literal("subscriptStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the subscript node"),
}).describe(
  "Subscripted content, with static children; used when parent node requires static content.",
);

export type SubscriptStatic = z.infer<typeof subscriptStaticSchema>;
