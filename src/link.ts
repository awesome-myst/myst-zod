// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type Link = Parent & {
  type: "link";
  children?: StaticPhrasingContent[];
  url: string;
  title?: string;
};

// @ts-expect-error TS2352
export const linkSchema: ZodType<Link> = parentSchema
  .extend({
    type: z.literal("link").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("static children of the link node"),
    url: z.string().describe("URL of the link"),
    title: z
      .string()
      .optional()
      .describe("advisory information, e.g. for a tooltip"),
  })
  .describe("Hyperlink");
