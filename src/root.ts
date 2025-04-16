// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";
import { blockSchema } from "./block.ts";
import { blockBreakSchema } from "./block-break.ts";

export const rootSchema = parentSchema.extend({
  type: z.literal("root").describe("identifier for node variant"),
  meta: z.string().optional().describe(
    "block metadata from preceding break; conventionally, a stringified JSON dictionary but may be any arbitrary string",
  ),
  children: z
    .array(z.union([flowContentSchema, blockSchema, blockBreakSchema]))
    .optional()
    .describe(
      "Top-level children of myst document",
    ),
}).describe(
  "Myst syntax tree built on existing mdast schemas",
);

export type Root = z.infer<typeof rootSchema>;
