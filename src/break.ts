// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const breakSchema = nodeSchema
  .extend({
    type: z.literal("break").describe("identifier for node variant"),
  }).describe("Line break");

export type Break = z.infer<typeof breakSchema>;
