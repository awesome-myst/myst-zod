// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type Abbreviation = Parent & {
  type: "abbreviation";
  children?: StaticPhrasingContent[];
  title?: string;
};

export const abbreviationSchema = parentSchema
  .extend({
    type: z.literal("abbreviation").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("children of the abbreviation node"),
    title: z
      .string()
      .optional()
      .describe("advisory information for the abbreviation"),
  })
  .describe("Abbreviation node described by title");
