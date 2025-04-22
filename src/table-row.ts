// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import { type TableCell, tableCellSchema } from "./table-cell.ts";

export type TableRow = Parent & {
  type: "tableRow";
  children?: TableCell[];
};

export const tableRowSchema: ZodType<TableRow> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("tableRow").describe("identifier for node variant"),
    children: z.array(tableCellSchema).optional().describe("Table row cells"),
  })
  .describe("One row of table containing cells");
