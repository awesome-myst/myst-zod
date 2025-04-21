// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";
import { flowContentSchema, type FlowContent } from "./flow-content.ts";

export type Directive = Parent & {
  type: "mystDirective";
  name: string;
  args?: string;
  options?: Record<string, unknown>;
  value?: string;
  children?: (PhrasingContent | FlowContent)[];
};

export const directiveSchema: ZodType<Directive> = parentSchema.extend({
  type: z.literal("mystDirective").describe("identifier for node variant"),
  name: z.string().describe("name of the directive"),
  args: z
    .string()
    .optional()
    .describe("arguments of the directive"),
  options: z.record(
    z.string(),
    z.any(),
  ).optional().describe("options of the directive"),
  value: z
    .string()
    .optional()
    .describe("body of the directive, excluding options"),
  children: z
    .array(z.union([phrasingContentSchema, flowContentSchema]))
    .optional()
    .describe("parsed directive content"),
}).describe("Content block with predefined behavior");
