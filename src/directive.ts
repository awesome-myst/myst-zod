// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "./phrasing-content.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";

export type Directive = Parent & {
  type: "mystDirective";
  name: string;
  args?: string;
  options?: Record<string, unknown>;
  value?: string;
  children?: (PhrasingContent | FlowContent)[];
};

// @ts-expect-error TS2352
export const directiveSchema: ZodType<Directive> = parentSchema
  .extend({
    type: z.literal("mystDirective").describe("identifier for node variant"),
    name: z.string().describe("name of the directive"),
    args: z.string().optional().describe("arguments of the directive"),
    options: z
      .record(z.string(), z.any())
      .optional()
      .describe("options of the directive"),
    value: z
      .string()
      .optional()
      .describe("body of the directive, excluding options"),
    children: z.lazy(() =>
      z
        .array(z.union([phrasingContentSchema, flowContentSchema]))
        .optional()
        .describe("parsed directive content")
    ),
  })
  .describe("Content block with predefined behavior");
