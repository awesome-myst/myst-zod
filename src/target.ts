// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const targetSchema = nodeSchema.extend({
  type: z.literal("mystTarget").describe("identifier for node variant"),
  label: z.string().optional().describe("unresolved label for the target"),
}).describe("Target node - provides identifier/label for the following node");

export type Target = z.infer<typeof targetSchema>;
