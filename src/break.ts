// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";

export type Break = Node & {
  type: "break";
};

export const breakSchema = nodeSchema
  .extend({
    type: z.literal("break").describe("identifier for node variant"),
  })
  .describe("Line break");
