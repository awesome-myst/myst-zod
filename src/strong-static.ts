// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export type StrongStatic = Parent & {
  type: "strong";
  children: StaticPhrasingContent[];
};

export const strongStaticSchema: ZodType<StrongStatic> = parentSchema
  .extend({
    type: z.literal("strong").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .describe("static children of the strong node"),
  })
  .describe(
    "Important, serious, urgent, bold content, with static children; used when parent node requires static content.",
  );
