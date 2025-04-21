// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type HTML = Node & {
  type: "html";
  value: string;
};

export const htmlSchema = nodeSchema
  .extend({
    type: z.literal("html").describe("identifier for node variant"),
    value: z.string().describe("HTML content of the HTML node"),
  })
  .describe("A HTML node");
