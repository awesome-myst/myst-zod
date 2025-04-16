// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const admonitionTitleSchema = parentSchema.extend({
  type: z.literal("admonitionTitle").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .describe("children of the admonitionTitle node"),
}).describe("Custom title for admonition, replaces kind as title");

export type AdmonitionTitle = z.infer<typeof admonitionTitleSchema>;
