// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const paragraphSchema = parentSchema.extend({
  type: z.literal("paragraph").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("text content of the paragraph"),
}).describe("A paragraph of text");

export type Paragraph = z.infer<typeof paragraphSchema>;
