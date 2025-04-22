// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type SuperscriptStatic = Parent & {
  type: "superscriptStatic";
  children?: StaticPhrasingContent[];
};

export const superscriptStaticSchema: ZodType<SuperscriptStatic> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z
      .literal("superscriptStatic")
      .describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(staticPhrasingContentSchema)
        .optional()
        .describe("static children of the superscript node")
    ),
  })
  .describe(
    "Superscripted content, with static children; used when parent node requires static content."
  );
