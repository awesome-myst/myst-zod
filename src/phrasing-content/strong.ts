// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";

export type Strong = Parent & {
  type: "strong";
  children?: PhrasingContent[];
};

export const strongSchema: ZodType<Strong> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("strong").describe("identifier for node variant"),
    children: z.lazy(() =>
      z
        .array(phrasingContentSchema)
        .optional()
        .describe("children of the strong node")
    ),
  })
  .describe("Important, serious, urgent, bold content");
