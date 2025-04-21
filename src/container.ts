// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { captionSchema, type Caption } from "./caption.ts";
import { legendSchema, type Legend } from "./legend.ts";
import { imageSchema, type Image } from "./image.ts";
import { tableSchema, type Table } from "./table.ts";

export type Container = Parent & {
  type: "container";
  kind: "figure" | "table";
  class?: string;
  enumerated?: boolean;
  enumerator?: string;
  children?: (Caption | Legend | Image | Table)[];
};

export const containerSchema: ZodType<Container> = parentSchema.extend({
  type: z.literal("container").describe("identifier for node variant"),
  kind: z.enum(["figure", "table"]).describe(
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
