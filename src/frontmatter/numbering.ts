// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type NumberingItem = {
  enabled?: boolean;
  start?: number;
  enumerator?: string;
  template?: string;
  continue?: boolean;
  offset?: number; // only applies to title
};

export type Numbering = {
  enumerator?: NumberingItem; // start, enabled, continue, and template ignored
  all?: NumberingItem; // start, template, enumerator ignored
  title?: NumberingItem; // start, continue, and template ignored
  figure?: NumberingItem;
  subfigure?: NumberingItem;
  equation?: NumberingItem;
  subequation?: NumberingItem;
  table?: NumberingItem;
  code?: NumberingItem;
  heading_1?: NumberingItem;
  heading_2?: NumberingItem;
  heading_3?: NumberingItem;
  heading_4?: NumberingItem;
  heading_5?: NumberingItem;
  heading_6?: NumberingItem;
} & Record<string, NumberingItem>;

export const numberingItemSchema: ZodType<NumberingItem> = z
  .object({
    enabled: z.boolean().optional().describe("Enable numbering"),
    start: z.number().optional().describe("Start number"),
    enumerator: z.string().optional().describe("Enumerator"),
    template: z.string().optional().describe("Template"),
    continue: z.boolean().optional().describe("Continue numbering"),
    offset: z.number().optional().describe("Offset for title numbering"),
  })
  .describe("Numbering item");

export const numberingSchema: ZodType<Numbering> = z
  .object({
    enumerator: numberingItemSchema.optional().describe("Enumerator"),
    all: numberingItemSchema.optional().describe("All items"),
    title: numberingItemSchema.optional().describe("Title"),
    figure: numberingItemSchema.optional().describe("Figure"),
    subfigure: numberingItemSchema.optional().describe("Subfigure"),
    equation: numberingItemSchema.optional().describe("Equation"),
    subequation: numberingItemSchema.optional().describe("Subequation"),
    table: numberingItemSchema.optional().describe("Table"),
    code: numberingItemSchema.optional().describe("Code"),
    heading_1: numberingItemSchema.optional().describe("Heading 1"),
    heading_2: numberingItemSchema.optional().describe("Heading 2"),
    heading_3: numberingItemSchema.optional().describe("Heading 3"),
    heading_4: numberingItemSchema.optional().describe("Heading 4"),
    heading_5: numberingItemSchema.optional().describe("Heading 5"),
    heading_6: numberingItemSchema.optional().describe("Heading 6"),
  })
  .describe("Numbering configuration for the notebook");
