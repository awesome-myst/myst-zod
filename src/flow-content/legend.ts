// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";

export type Legend = Parent & {
  type: "legend";
  children?: FlowContent[];
};

export const legendSchema: ZodType<Legend> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("legend").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(flowContentSchema)
        .optional()
        .describe("Children of the legend node")
    ),
  })
  .describe("Legend for container element");
