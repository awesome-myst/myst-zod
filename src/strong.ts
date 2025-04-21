// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Strong = Parent & {
  type: "strong";
  children?: PhrasingContent[];
};

// @ts-expect-error TS2352
export const strongSchema: ZodType<Strong> = parentSchema
  .extend({
    type: z.literal("strong").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("children of the strong node")
    ),
  })
  .describe("Important, serious, urgent, bold content");
