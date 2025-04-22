// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type AdmonitionTitle = Parent & {
  type: "admonitionTitle";
  children?: PhrasingContent[];
};

export const admonitionTitleSchema: ZodType<AdmonitionTitle> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("admonitionTitle").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .optional()
      .describe("children of the admonitionTitle node"),
  })
  .describe("Custom title for admonition, replaces kind as title");
