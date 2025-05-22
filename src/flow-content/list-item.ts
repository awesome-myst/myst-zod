// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type ListItem = Parent & {
  type: "listItem";
  spread?: boolean;
  children?: (FlowContent | PhrasingContent)[];
};

export const listItemSchema: ZodType<ListItem> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("listItem").describe("identifier for node variant"),
    spread: z
      .boolean()
      .optional()
      .describe(
        "One or more children are separated with a blank line from others",
      ),
    children: z.lazy(() =>
      z
        .array(z.union([flowContentSchema, phrasingContentSchema]))
        .optional()
        .describe("content of the list item")
    ),
  })
  .describe("List item");
