// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import { type Caption, captionSchema } from "./caption.ts";
import { type Legend, legendSchema } from "./legend.ts";
import { type Image, imageSchema } from "../phrasing-content/static/image.ts";
import { type Table, tableSchema } from "./table.ts";

export type Container = Parent & {
  type: "container";
  kind: "figure" | "table";
  class?: string;
  enumerated?: boolean;
  enumerator?: string;
  children?: (Caption | Legend | Image | Table)[];
};

export const containerSchema: ZodType<Container> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("container").describe("identifier for node variant"),
    kind: z.enum(["figure", "table"]).describe("kind of container elements"),
    class: z.string().optional().describe("any custom class information"),
    enumerated: z
      .boolean()
      .optional()
      .describe(
        "count this container for numbering based on kind, e.g. Figure 1a"
      ),
    enumerator: z
      .string()
      .optional()
      .describe("resolved enumerated value for this container"),
    children: z
      .array(z.union([captionSchema, legendSchema, imageSchema, tableSchema]))
      .optional()
      .describe(
        "An optional `containerTitle` followed by the containers content."
      ),
  })
  .describe(
    "Container node for drawing attention to text, separate from the neighboring content"
  );
