// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export type SuperscriptStatic = Parent & {
  type: "superscriptStatic";
  children?: StaticPhrasingContent[];
};

export const superscriptStaticSchema: ZodType<SuperscriptStatic> = parentSchema.extend({
  type: z.literal("superscriptStatic").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .optional()
    .describe("static children of the superscript node"),
}).describe(
  "Superscripted content, with static children; used when parent node requires static content.",
);
