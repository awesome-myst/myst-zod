// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type EmphasisStatic = Parent & {
  type: "emphasisStatic";
  children?: StaticPhrasingContent[];
};

// @ts-expect-error TS2352
export const emphasisStaticSchema: ZodType<EmphasisStatic> = parentSchema
  .extend({
    type: z.literal("emphasisStatic").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(staticPhrasingContentSchema)
        .optional()
        .describe("static children of the emphasis node")
    ),
  })
  .describe(
    "Stressed, italicized content, with static children; used when parent node requires static content",
  );
