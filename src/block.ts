// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type FlowContent,
  flowContentSchema,
} from "./flow-content/flow-content.ts";
import { type ListItem, listItemSchema } from "./flow-content/list-item.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content/phrasing-content.ts";

export type Block = Parent & {
  type: "block";
  meta?: string;
  children?: (FlowContent | ListItem | PhrasingContent)[];
};

export const blockSchema: ZodType<Block> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("block").describe("identifier for node variant"),
    meta: z
      .string()
      .optional()
      .describe(
        "block metadata from preceding break; conventionally, a stringified JSON dictionary but may be any arbitrary string"
      ),
    children: z.lazy(() =>
      z
        .array(
          z.discriminatedUnion("type", [
            // @ts-expect-error TS2339
            flowContentSchema,
            listItemSchema,
            phrasingContentSchema,
          ])
        )
        .optional()
        .describe("Top-level children of myst document")
    ),
  })
  .describe(
    "Top-level content blocks or cells the myst document, delimited by BlockBreaks"
  );
