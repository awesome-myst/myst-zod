// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
export type Blockquote = Parent & {
  type: "blockquote";
  children?: FlowContent[];
};

export const blockquoteSchema: ZodType<Blockquote> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("blockquote").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(flowContentSchema)
        .optional()
        .describe("content of the block quote")
    ),
  })
  .describe("Block quote");
