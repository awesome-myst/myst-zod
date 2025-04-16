// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const subscriptSchema = parentSchema.extend({
  type: z.literal("subscript").describe("identifier for node variant"),
  children: z
    .array(phrasingContentSchema)
    .describe("children of the subscript node"),
}).describe(
  "Subscript content, using role {subscript}",
);

export type Subscript = z.infer<typeof subscriptSchema>;
