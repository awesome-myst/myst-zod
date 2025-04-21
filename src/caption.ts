// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema, type Parent } from "./parent.ts"; // Assuming Parent type is exported
import { flowContentSchema, type FlowContent } from "./flow-content.ts"; // Assuming FlowContent type is exported

export interface Caption extends Parent {
  type: "caption";
  children?: FlowContent[];
}

export const captionSchema: z.ZodType<Caption> = parentSchema.extend({
  type: z.literal("caption").describe("identifier for node variant"),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("Children of the caption node"),
}).describe("Caption for container element");