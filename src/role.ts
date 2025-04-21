// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { nodeSchema, type Node } from "./node.ts";
import { phrasingContentSchema, type PhrasingContent } from "./phrasing-content.ts";

export type Role = Node & {
  type: "mystRole";
  name: string;
  value?: string;
  children?: PhrasingContent[];
};

export const roleSchema: ZodType<Role> = nodeSchema.extend({
  type: z.literal("mystRole").describe("identifier for node variant"),
  name: z.string().describe("name of the role"),
  value: z.string().optional().describe("content of the directive"),
  children: z.array(phrasingContentSchema).optional().describe(
    "parsed role content",
  ),
}).describe("A role directive in MyST Markdown");
