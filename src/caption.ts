// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";

export const captionSchema = parentSchema.extend({
  type: z.literal("caption").describe("identifier for node variant"),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("Children of the caption node"),
}).describe("Caption for container element");

export type Caption = z.infer<typeof captionSchema>;
