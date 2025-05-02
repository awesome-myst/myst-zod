// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type XRefReference = {
  identifier?: string;
  html_id?: string;
  // kind:
  //   | "page"
  //   | "heading"
  //   | "figure"
  //   | "table"
  //   | "equation"
  //   | "tabSet"
  //   | "tabItem"
  //   | "blockquote"
  //   | "block"
  //   | "code"
  //   | "definitionList"
  //   | "myst"
  //   | "image"
  //   ...
  kind: string;
  data: string;
  url: string;
  implicit?: boolean;
};
export type XRef = {
  version: string;
  myst?: string;
  references: XRefReference[];
};

export const xrefReferenceSchema: ZodType<XRefReference> = z
  .object({
    // Optional for 'page' kind, required for all others
    identifier: z
      .string()
      .optional()
      .describe("Unique identifier in the project (optional for pages)"),

    // Only included if different from identifier
    html_id: z
      .string()
      .optional()
      .describe("HTML identifier, stricter than the regular identifier"),

    kind: z
      .string()
      .describe("Kind of reference (e.g., page, heading, figure, table)"),

    data: z.string().describe("Relative URL path to the reference data"),

    url: z.string().describe("Relative URL path to the HTML page"),

    implicit: z
      .boolean()
      .optional()
      .describe("Whether the reference is implicit to a page"),
  })
  .refine(
    (data) => {
      // Ensure identifier is present for non-page kinds
      if (data.kind !== "page" && !data.identifier) {
        return false;
      }
      return true;
    },
    {
      message: "Identifier is required for non-page references",
      path: ["identifier"],
    },
  );

export const xrefSchema: ZodType<XRef> = z
  .object({
    version: z.string().describe("Version of the myst.xref.json schema"),

    myst: z
      .string()
      .optional()
      .describe("Version of mystmd CLI that created this data"),

    references: z
      .array(xrefReferenceSchema)
      .describe("List of references exposed by the project"),
  })
  .describe("MyST cross-reference JSON schema");
