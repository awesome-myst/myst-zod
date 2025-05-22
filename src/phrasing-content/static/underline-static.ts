// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type UnderlineStatic = Parent & {
  type: "underlineStatic";
  children?: StaticPhrasingContent[];
};

export const underlineStaticSchema: ZodType<UnderlineStatic> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("underlineStatic").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(staticPhrasingContentSchema)
        .optional()
        .describe("static children of the underline node")
    ),
  })
  .describe(
    "Underline content, with static children; used when parent node requires static content.",
  );
