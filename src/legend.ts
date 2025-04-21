// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { flowContentSchema, type FlowContent } from "./flow-content.ts";

export type Legend = Parent & {
  type: "legend";
  children?: FlowContent[];
}
export const legendSchema: ZodType<Legend> = parentSchema.extend({
  type: z.literal("legend").describe("identifier for node variant"),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("Children of the legend node"),
}).describe("Legend for container element");
