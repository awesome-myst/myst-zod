// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { listItemSchema, type ListItem } from "./list-item.ts";

export type List = Parent & {
  type: "list";
  ordered?: boolean;
  start?: number;
  spread?: boolean;
  children?: ListItem[];
};

export const listSchema: ZodType<List> = parentSchema.extend({
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
