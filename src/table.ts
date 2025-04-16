// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { tableRowSchema } from "./table-row.ts";

export const tableSchema = parentSchema.extend({
  type: z.literal("table").describe("identifier for node variant"),
  align: z.enum(["left", "center", "right"]).optional().describe(
    "alignment of the table",
  ),
  children: z.array(tableRowSchema).optional().describe("Table rows"),
}).describe("Two-dimensional table data");

export type Table = z.infer<typeof tableSchema>;
