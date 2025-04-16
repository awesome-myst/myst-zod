// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";

export const legendSchema = parentSchema.extend({
  type: z.literal("legend").describe("identifier for node variant"),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("Children of the legend node"),
}).describe("Legend for container element");

export type Legend = z.infer<typeof legendSchema>;
