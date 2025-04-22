// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Link = Parent & {
  type: "link";
  children?: PhrasingContent[];
  url: string;
  title?: string;
};

export const linkSchema: ZodType<Link> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("link").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("static children of the link node")
    ),
    url: z.string().describe("URL of the link"),
    title: z
      .string()
      .optional()
      .describe("advisory information, e.g. for a tooltip"),
  })
  .describe("Hyperlink");
