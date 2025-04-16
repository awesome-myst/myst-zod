// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const commentSchema = nodeSchema.extend({
  type: z.literal("mystComment").describe("identifier for node variant"),
  value: z.string().optional().describe("The text content of the comment"),
}).describe(
  "Comment nodes for comments present in myst but ignored upon render",
);

export type Comment = z.infer<typeof commentSchema>;
