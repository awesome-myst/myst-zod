// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "../static-phrasing-content.ts";

export type Delete = Parent & {
  type: "delete";
  children?: StaticPhrasingContent[];
};

export const deleteSchema: ZodType<Delete> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("delete").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("static phrasing content"),
  })
  .describe("Delete represents strikethrough text");
