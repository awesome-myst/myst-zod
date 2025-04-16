// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";
import { listItemSchema } from "./list-item.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const blockSchema = parentSchema.extend({
  type: z.literal("block").describe("identifier for node variant"),
  meta: z.string().optional().describe(
    "block metadata from preceding break; conventionally, a stringified JSON dictionary but may be any arbitrary string",
  ),
  children: z
    .array(z.union([flowContentSchema, listItemSchema, phrasingContentSchema]))
    .optional()
    .describe(
      "Top-level children of myst document",
    ),
}).describe(
  "Top-level content blocks or cells the myst document, delimited by BlockBreaks",
);

export type Block = z.infer<typeof blockSchema>;
