// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const emphasisSchema = parentSchema
  .extend({
    type: z.literal("emphasis").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .describe("children of the emphasis node"),
  })
  .describe("Stressed, italicized content");

export type Emphasis = z.infer<typeof emphasisSchema>;
