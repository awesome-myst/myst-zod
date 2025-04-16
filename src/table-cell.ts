// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const tableCellSchema = parentSchema.extend({
  type: z.literal("tableCell").describe("identifier for node variant"),
  header: z.boolean().optional().describe("true if this cell is a header cell"),
  align: z
    .enum(["left", "center", "right"])
    .optional()
    .describe("alignment of the cell content"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("Content of the table cell"),
}).describe("One cell of a table");

export type TableCell = z.infer<typeof tableCellSchema>;
