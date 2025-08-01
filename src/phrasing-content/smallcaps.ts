// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "../static-phrasing-content.ts";

export type Smallcaps = Parent & {
  type: "smallcaps";
  children?: StaticPhrasingContent[];
};

export const smallcapsSchema: ZodType<Smallcaps> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("smallcaps").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("static phrasing content"),
  })
  .describe("Smallcaps represents text in small capital letters");
