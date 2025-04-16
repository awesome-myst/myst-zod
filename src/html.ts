// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const htmlSchema = nodeSchema.extend({
  type: z.literal("html").describe("identifier for node variant"),
  value: z.string().describe("HTML content of the HTML node"),
}).describe("A HTML node");

export type Html = z.infer<typeof htmlSchema>;
