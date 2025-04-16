// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { captionSchema } from "./caption.ts";
import { legendSchema } from "./legend.ts";
import { imageSchema } from "./image.ts";
import { tableSchema } from "./table.ts";

export const containerSchema = parentSchema.extend({
  type: z.literal("container").describe("identifier for node variant"),
  kind: z.union([z.literal("figure"), z.literal("table")]).describe(
    "kind of container elements",
  ),
  class: z.string().optional().describe("any custom class information"),
  enumerated: z.boolean().optional().describe(
    "count this container for numbering based on kind, e.g. Figure 1a",
  ),
  enumerator: z
    .string()
    .optional()
    .describe("resolved enumerated value for this container"),
  children: z
    .array(z.union([captionSchema, legendSchema, imageSchema, tableSchema]))
    .optional()
    .describe(
      "An optional `containerTitle` followed by the containers content.",
    ),
}).describe(
  "Container node for drawing attention to text, separate from the neighboring content",
);

export type Container = z.infer<typeof containerSchema>;
