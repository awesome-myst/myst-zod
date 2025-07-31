// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type SubscriptStatic = Parent & {
  type: "subscriptStatic";
  children?: StaticPhrasingContent[];
};

export const subscriptStaticSchema: ZodType<SubscriptStatic> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("subscriptStatic").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(staticPhrasingContentSchema)
        .optional()
        .describe("static children of the subscript node")
    ),
  })
  .describe(
    "Subscripted content, with static children; used when parent node requires static content.",
  );
