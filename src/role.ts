// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const roleSchema = nodeSchema.extend({
  type: z.literal("mystRole").describe("identifier for node variant"),
  name: z.string().describe("name of the role"),
  value: z.string().optional().describe("content of the directive"),
  children: z.array(phrasingContentSchema).optional().describe(
    "parsed role content",
  ),
}).describe("A role directive in MyST Markdown");

export type Role = z.infer<typeof roleSchema>;
