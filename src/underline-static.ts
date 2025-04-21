// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export type UnderlineStatic = Parent & {
  type: "underlineStatic";
  children: StaticPhrasingContent[];
};

export const underlineStaticSchema: ZodType<UnderlineStatic> = parentSchema.extend({
  type: z.literal("underlineStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the underline node"),
}).describe(
  "Underline content, with static children; used when parent node requires static content.",
);
