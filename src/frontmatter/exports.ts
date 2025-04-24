// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type TOC, tocSchema } from "../toc.ts";

export enum ExportFormats {
  pdf = "pdf",
  tex = "tex",
  pdftex = "pdf+tex",
  typst = "typst",
  docx = "docx",
  xml = "xml",
  md = "md",
  meca = "meca",
  cff = "cff",
}

export type ExportArticle = {
  file?: string;
  level?: number;
  title?: string;
  // Page frontmatter defined here will override file frontmatter
};

export type Export = {
  id?: string;
  format?: ExportFormats;
  template?: string | null;
  output?: string;
  zip?: boolean;
  toc?: TOC;
  articles?: ExportArticle[];
  top_level?: "parts" | "chapters" | "sections";
  /** sub_articles are only for jats xml export */
  sub_articles?: string[];
  /** MECA: to, from later */
  /** tocFile is not set by user; it will be set instead of `toc` when user provides a string for `toc`*/
  tocFile?: string;
};

export const exportFormatsSchema: ZodType<ExportFormats> = z.nativeEnum(
  ExportFormats,
).describe("export formats");

export const exportArticleSchema: ZodType<ExportArticle> = z.object({
  file: z.string().optional().describe("file name"),
  level: z.number().optional().describe("level of the article"),
  title: z.string().optional().describe("title of the article"),
}).describe("Export article");

export const exportSchema: ZodType<Export> = z.object({
  id: z.string().optional().describe("identifier for the export"),
  format: exportFormatsSchema.optional().describe("export format"),
  template: z.string().optional().nullable().describe(
    "template for the export",
  ),
  output: z.string().optional().describe("output file name"),
  zip: z.boolean().optional().describe("whether to zip the output"),
  toc: tocSchema.optional().describe("table of contents for the export"),
  articles: z.array(exportArticleSchema).optional().describe(
    "articles for the export",
  ),
  top_level: z.enum(["parts", "chapters", "sections"]).optional().describe(
    "top level for the export",
  ),
  sub_articles: z.array(z.string()).optional().describe(
    "sub articles for the export",
  ),
  tocFile: z.string().optional().describe("toc file for the export"),
}).describe("Export configuration");
