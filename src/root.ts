// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
import { type Block, blockSchema } from "./block.ts";
import { type BlockBreak, blockBreakSchema } from "./block-break.ts";

export type Root = Parent & {
  type: "root";
  meta?: string;
  children?: (FlowContent | Block | BlockBreak)[];
};

export const rootSchema = parentSchema
  .extend({
    type: z.literal("root").describe("identifier for node variant"),
    meta: z
      .string()
      .optional()
      .describe(
        "block metadata from preceding break; conventionally, a stringified JSON dictionary but may be any arbitrary string",
      ),
    children: z
      .array(z.union([flowContentSchema, blockSchema, blockBreakSchema]))
      .optional()
      .describe("Top-level children of myst document"),
  })
  .describe("Myst syntax tree built on existing mdast schemas");
