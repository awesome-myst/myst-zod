// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Parent = Node & {
  children: Node[];
};

export const parentSchema = nodeSchema
  .extend({
    children: z.array(nodeSchema).describe("children of the parent node"),
  })
  .describe("Basic node with node children");
