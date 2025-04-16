// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { tableCellSchema } from "./table-cell.ts";

export const tableRowSchema = parentSchema.extend({
  type: z.literal("tableRow").describe("identifier for node variant"),
  children: z.array(tableCellSchema).optional().describe("Table row cells"),
}).describe("One row of table containing cells");

export type TableRow = z.infer<typeof tableRowSchema>;
