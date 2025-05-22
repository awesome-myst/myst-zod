// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type Paragraph = Parent & {
  type: "paragraph";
  children?: PhrasingContent[];
};

export const paragraphSchema: ZodType<Paragraph> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("paragraph").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .optional()
      .describe("text content of the paragraph"),
  })
  .describe("A paragraph of text");
