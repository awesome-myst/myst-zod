// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Subscript = Parent & {
  type: "subscript";
  children?: PhrasingContent[];
};

// @ts-expect-error TS2352
export const subscriptSchema: ZodType<Subscript> = parentSchema
  .extend({
    type: z.literal("subscript").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("children of the subscript node")
    ),
  })
  .describe("Subscript content, using role {subscript}");
