// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const listItemSchema = parentSchema.extend({
  type: z.literal("listItem").describe("identifier for node variant"),
  spread: z
    .boolean()
    .optional()
    .describe(
      "One or more children are separated with a blank line from others",
    ),
  children: z
    .array(z.union([flowContentSchema, phrasingContentSchema]))
    .optional()
    .describe("content of the list item"),
}).describe("List item");

export type ListItem = z.infer<typeof listItemSchema>;
