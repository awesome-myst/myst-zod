// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Parent = Node & {
  children: Node[];
};

export const parentSchema: ZodType<Node> = nodeSchema
  // @ts-expect-error TS2339
  .extend({
    children: z.array(nodeSchema).describe("children of the parent node"),
  })
  .describe("Basic node with node children");
