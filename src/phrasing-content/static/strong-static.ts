// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type StrongStatic = Parent & {
  type: "strongStatic";
  children?: StaticPhrasingContent[];
};

export const strongStaticSchema: ZodType<StrongStatic> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("strongStatic").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(staticPhrasingContentSchema)
        .optional()
        .describe("static children of the strong node")
    ),
  })
  .describe(
    "Important, serious, urgent, bold content, with static children; used when parent node requires static content."
  );
