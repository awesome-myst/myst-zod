// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { staticPhrasingContentSchema, type StaticPhrasingContent } from "./static-phrasing-content.ts";

export type Link = Parent & {
  type: "link";
  children: StaticPhrasingContent[];
  url: string;
  title?: string;
};

export const linkSchema: ZodType<Link> = parentSchema.extend({
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