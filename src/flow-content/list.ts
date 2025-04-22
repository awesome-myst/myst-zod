// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import { type ListItem, listItemSchema } from "./list-item.ts";

export type List = Parent & {
  type: "list";
  ordered?: boolean;
  start?: number;
  spread?: boolean;
  children?: ListItem[];
};

export const listSchema: ZodType<List> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("list").describe("identifier for node variant"),
    ordered: z
      .boolean()
      .optional()
      .describe("list is ordered (numbered) or unordered (bulleted)"),
    start: z.number().optional().describe("the starting number of the list"),
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
  })
  .describe("List");
