// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

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

const numberingItemTransform = (data: unknown, ctx: RefinementCtx) => {
  if (typeof data === "number") {
    // check that the number is positive and not a fraction
    if (data < 0 || !Number.isInteger(data)) {
      ctx.issues.push({
        code: "custom",
        message: "Numbering item must be a positive integer",
        input: data,
      });
    }
  }
  return data;
};

/**
 * Value may be:
 * - boolean, to simply enable/disable numbering
 * - number, to indicate the starting number
 * - string, to define the cross-reference template
 *   (e.g. 'Fig. %s' to get "Fig. 1" instead of "Figure 1" in your document)
 * - An object with any of enabled/start/template - specifying the above types
 *   will coerce to this object
 */
// @ts-ignore: // inconsistent TS2322
export const numberingItemSchema: ZodType<NumberingItem> = z
  .union([
    z.boolean().transform((data) => ({ enabled: data })),
    z.number().transform((data, ctx: RefinementCtx) => {
      const result = numberingItemTransform(data, ctx);
      return { start: result };
    }),
    z.string().transform((data) => {
      if (["true", "false"].includes(data.toLowerCase())) {
        return { enabled: data === "true" };
      }
      return { template: data };
    }),
    z.object({
      enabled: z.boolean().optional().describe("Enable numbering"),
      start: z
        .number()
        .optional()
        .transform(numberingItemTransform)
        .describe("Start number"),
      enumerator: z.string().optional().describe("Enumerator"),
      template: z.string().optional().describe("Template"),
      continue: z.boolean().optional().describe("Continue numbering"),
      offset: z.number().optional().describe("Offset for title numbering"),
    }),
  ])
  .describe("Numbering item");

// @ts-ignore: // inconsistent TS2322
export const numberingSchema: ZodType<Numbering> = z
  .preprocess(
    (data) => {
      if (
        typeof data === "boolean" ||
        (typeof data === "string" &&
          ["true", "false"].includes(data.toLowerCase()))
      ) {
        return { all: data };
      }
      return data;
    },
    z.object({
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
  )
  .describe("Numbering configuration for the notebook");
