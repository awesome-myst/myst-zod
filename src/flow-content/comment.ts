// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "../node.ts";

export type MystComment = Node & {
  type: "mystComment";
  value?: string;
};

export type Comment = Node & {
  type: "comment";
  value?: string;
};

export const mystCommentSchema: ZodType<MystComment> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("mystComment").describe("identifier for node variant"),
    value: z.string().optional().describe("The text content of the comment"),
  })
  .describe(
    "Comment nodes for comments present in myst but ignored upon render",
  );

export const commentSchema: ZodType<Comment> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("comment").describe("identifier for node variant"),
    value: z.string().optional().describe("The text content of the comment"),
  })
  .describe(
    "Comment nodes for comments present in myst but ignored upon render",
  );
