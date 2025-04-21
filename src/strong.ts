// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Strong = Parent & {
  type: "strong";
  children?: PhrasingContent[];
};

export const strongSchema: ZodType<Strong> = parentSchema.extend({
  type: z.literal("strong").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("children of the strong node"),
}).describe("Important, serious, urgent, bold content");
