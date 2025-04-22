// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import { type TableRow, tableRowSchema } from "./table-row.ts";

export type Table = Parent & {
  type: "table";
  align?: "left" | "center" | "right";
  children?: TableRow[];
};

export const tableSchema: ZodType<Table> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("table").describe("identifier for node variant"),
    align: z
      .enum(["left", "center", "right"])
      .optional()
      .describe("alignment of the table"),
    children: z.array(tableRowSchema).optional().describe("Table rows"),
  })
  .describe("Two-dimensional table data");
