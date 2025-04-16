// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { listItemSchema } from "./list-item.ts";

export const listSchema = parentSchema.extend({
  type: z.literal("list").describe("identifier for node variant"),
  ordered: z
    .boolean()
    .optional()
    .describe("list is ordered (numbered) or unordered (bulleted)"),
  start: z
    .number()
    .optional()
    .describe("the starting number of the list"),
  spread: z
    .boolean()
    .optional()
    .describe(
      "One or more children are separated with a blank line from others",
    ),
  children: z
    .array(listItemSchema)
    .optional()
    .describe("content of the block quote"),
}).describe("List");

export type List = z.infer<typeof listSchema>;
