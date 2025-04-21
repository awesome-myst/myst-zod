// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Paragraph = Parent & {
  type: "paragraph";
  children?: PhrasingContent[];
};

// @ts-expect-error TS2352
export const paragraphSchema: ZodType<Paragraph> = parentSchema
  .extend({
    type: z.literal("paragraph").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .optional()
      .describe("text content of the paragraph"),
  })
  .describe("A paragraph of text");
