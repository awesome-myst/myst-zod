// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Subscript = Parent & {
  type: "subscript";
  children: PhrasingContent[];
};

export const subscriptSchema: ZodType<Parent> = parentSchema.extend({
  type: z.literal("subscript").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .describe("children of the subscript node"),
}).describe(
  "Subscript content, using role {subscript}",
);
