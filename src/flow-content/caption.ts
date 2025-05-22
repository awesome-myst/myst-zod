// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../parent.ts"; // Assuming Parent type is exported
import { type FlowContent, flowContentSchema } from "./flow-content.ts"; // Assuming FlowContent type is exported

export type Caption = Parent & {
  type: "caption";
  children?: FlowContent[];
};

export const captionSchema: ZodType<Caption> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("caption").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(flowContentSchema)
        .optional()
        .describe("Children of the caption node")
    ),
  })
  .describe("Caption for container element");
