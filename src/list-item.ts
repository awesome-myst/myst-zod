// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { flowContentSchema, type FlowContent } from "./flow-content.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type ListItem = Parent & {
  type: "listItem";
  spread?: boolean;
  children?: (FlowContent | PhrasingContent)[];
};

export const listItemSchema: ZodType<ListItem> = parentSchema.extend({
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
