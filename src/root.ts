// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type FlowContent,
  uniqueFlowContentSchema,
} from "./flow-content/flow-content.ts";
import { type Block, blockSchema } from "./block.ts";
import { type BlockBreak, blockBreakSchema } from "./block-break.ts";
import type { ListContent } from "./flow-content/list-content.ts";
import { listItemSchema } from "./flow-content/list-item.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content/phrasing-content.ts";

export type Root = Parent & {
  type: "root";
  meta?: string;
  children?:
    | (Block | BlockBreak | FlowContent)[]
    | ListContent[]
    | PhrasingContent[];
};

export const rootSchema: ZodType<Root> = parentSchema
  // @ts-expect-error TS2339
  .extend({
    type: z.literal("root").describe("identifier for node variant"),
    meta: z
      .string()
      .optional()
      .describe(
        "block metadata from preceding break; conventionally, a stringified JSON dictionary but may be any arbitrary string",
      ),
    children: z
      .array(
        z.discriminatedUnion("type", [
          // @ts-expect-error TS2339
          ...uniqueFlowContentSchema,
          blockSchema,
          blockBreakSchema,
          listItemSchema,
          // @ts-expect-error TS2339
          ...phrasingContentSchema.options,
        ]),
      )
      .optional()
      .describe("Top-level children of myst document"),
  })
  .describe("Myst syntax tree built on existing mdast schemas");
