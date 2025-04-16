// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const parentSchema = nodeSchema.extend({
  children: z.array(nodeSchema).describe("List of child nodes"),
}).describe("Basic node with required node children");

export type Parent = z.infer<typeof parentSchema>;
