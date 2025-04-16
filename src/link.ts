// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const linkSchema = parentSchema.extend({
  type: z.literal("link").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the link node"),
  url: z
    .string()
    .describe("URL of the link"),
  title: z
    .string()
    .optional()
    .describe("advisory information, e.g. for a tooltip"),
}).describe(
  "Hyperlink",
);

export type Link = z.infer<typeof linkSchema>;
