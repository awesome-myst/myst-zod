// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";
import { flowContentSchema } from "./flow-content.ts";

export const directiveSchema = parentSchema.extend({
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

export type Directive = z.infer<typeof directiveSchema>;
