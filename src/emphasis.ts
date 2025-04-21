// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Emphasis = Parent & {
  type: "emphasis";
  children?: PhrasingContent[];
}

export const emphasisSchema: ZodType<Emphasis> = parentSchema
  .extend({
    type: z.literal("emphasis").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .describe("children of the emphasis node"),
  })
  .describe("Stressed, italicized content");
