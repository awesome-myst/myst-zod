// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const abbreviationSchema = parentSchema.extend({
  type: z.literal("abbreviation").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("children of the abbreviation node"),
  title: z
    .string()
    .optional()
    .describe("advisory information for the abbreviation"),
}).describe(
  "Abbreviation node described by title",
);

export type Abbreviation = z.infer<typeof abbreviationSchema>;
