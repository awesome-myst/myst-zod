// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Underline = Parent & {
  type: "underline";
  children?: PhrasingContent[];
};

// @ts-expect-error TS2352
export const underlineSchema: ZodType<Underline> = parentSchema
  .extend({
    type: z.literal("underline").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("children of the underline node")
    ),
  })
  .describe("Underline content, using role {underline}");
