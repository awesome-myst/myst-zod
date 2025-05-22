// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Superscript = Parent & {
  type: "superscript";
  children?: PhrasingContent[];
};

export const superscriptSchema: ZodType<Superscript> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("superscript").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("children of the superscript node")
    ),
  })
  .describe("Superscript content, using role {superscript}");
