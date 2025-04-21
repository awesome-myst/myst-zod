// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export type SubscriptStatic = Parent & {
  type: "subscriptStatic";
  children: StaticPhrasingContent[];
};

export const subscriptStaticSchema: ZodType<SubscriptStatic> = parentSchema.extend({
  type: z.literal("subscriptStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the subscript node"),
}).describe(
  "Subscripted content, with static children; used when parent node requires static content.",
);
