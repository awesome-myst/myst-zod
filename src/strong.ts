// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const strongSchema = parentSchema.extend({
  type: z.literal("strong").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("children of the strong node"),
}).describe("Important, serious, urgent, bold content");

export type Strong = z.infer<typeof strongSchema>;
