// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Target = Node & {
  type: "mystTarget";
  label?: string;
};

export const targetSchema: ZodType<Target> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("mystTarget").describe("identifier for node variant"),
    label: z.string().optional().describe("unresolved label for the target"),
  })
  .describe("Target node - provides identifier/label for the following node");
