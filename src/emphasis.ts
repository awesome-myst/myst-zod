// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Emphasis = Parent & {
  type: "emphasis";
  children?: PhrasingContent[];
};

// @ts-expect-error TS2352
export const emphasisSchema: ZodType<Emphasis> = parentSchema
  .extend({
    type: z.literal("emphasis").describe("identifier for node variant"),
    children: z.lazy(() =>
      z.array(phrasingContentSchema).describe("children of the emphasis node")
    ),
  })
  .describe("Stressed, italicized content");
