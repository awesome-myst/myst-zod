// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type TableCell = Parent & {
  type: "tableCell";
  header?: boolean;
  align?: "left" | "center" | "right";
  children?: PhrasingContent[];
};

export const tableCellSchema: ZodType<TableCell> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("tableCell").describe("identifier for node variant"),
    header: z
      .boolean()
      .optional()
      .describe("true if this cell is a header cell"),
    align: z
      .enum(["left", "center", "right"])
      .optional()
      .describe("alignment of the cell content"),
    children: z
      .array(phrasingContentSchema)
      .optional()
      .describe("Content of the table cell"),
  })
  .describe("One cell of a table");
