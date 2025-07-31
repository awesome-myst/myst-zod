// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

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

export const EXT_TO_FORMAT: Record<string, ExportFormats> = {
  ".pdf": ExportFormats.pdf,
  ".tex": ExportFormats.tex,
  ".doc": ExportFormats.docx,
  ".docx": ExportFormats.docx,
  ".md": ExportFormats.md,
  ".zip": ExportFormats.meca,
  ".meca": ExportFormats.meca,
  ".xml": ExportFormats.xml,
  ".jats": ExportFormats.xml,
  ".typ": ExportFormats.typst,
  ".typst": ExportFormats.typst,
  ".cff": ExportFormats.cff,
};

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

const exportFormatPreprocessor = (data: unknown) => {
  if (data === "tex+pdf") {
    return ExportFormats.pdftex;
  }
  if (data === "jats") {
    return ExportFormats.xml;
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const exportFormatsSchema: ZodType<ExportFormats> = z
  .preprocess(exportFormatPreprocessor, z.nativeEnum(ExportFormats))
  .describe("export formats");

const exportArticleTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
) => {
  if (typeof data === "string") {
    return { file: data };
  }

  if (!data.file && !data.title) {
    ctx.issues.push({
      code: "custom",
      message: "Export article must have at least one of `file` or `title`",
      input: data,
    });
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const exportArticleSchema: ZodType<ExportArticle> = z
  .union([
    z.string(),
    z.object({
      file: z.string().optional().describe("file name"),
      level: z
        .number()
        .min(-1)
        .max(6)
        .int()
        .optional()
        .describe("level of the article"),
      title: z.string().optional().describe("title of the article"),
    }),
  ])
  .transform(exportArticleTransform)
  .describe("Export article");

const exportTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
) => {
  if (typeof data === "string") {
    // If export is a string it may be (1) format, (2) extension, or (3) output filename
    let format: string | undefined;
    let output: string | undefined;
    if (data.startsWith(".")) {
      Object.entries(EXT_TO_FORMAT).forEach(([ext, fmt]) => {
        if (data === ext) format = fmt; // Input is a known, format-specific extension
      });
    } else if (data.includes(".")) {
      output = data; // Input is filename; format TBD
    } else if (data in ExportFormats) {
      format = data; // Input is a known format
    }
    if (format) {
      format = exportFormatPreprocessor(format) as string;
    }
    data = { format, output };
  }

  if (data.article) {
    if (data.articles) {
      ctx.issues.push({
        code: "custom",
        message: "Cannot use both `article` and `articles`",
        input: data,
      });
    }
    data.articles = [data.article];
    delete data.article;
  }
  if (data.sub_article) {
    if (data.sub_articles) {
      ctx.issues.push({
        code: "custom",
        message: "Cannot use both `sub_article` and `sub_articles`",
        input: data,
      });
    }
    data.sub_articles = [data.sub_article];
    delete data.sub_article;
  }

  if (!data.format && !data.template && !data.output) {
    ctx.issues.push({
      code: "custom",
      message:
        "Export must have at least one of `format`, `template`, or `output`",
      input: data,
    });
  }

  if (data.sub_articles && data.format !== ExportFormats.xml) {
    ctx.issues.push({
      code: "custom",
      message: "sub_articles is only supported for jats export",
      input: data,
    });
  }

  if (
    data.format &&
    [ExportFormats.md, ExportFormats.docx].includes(
      data.format as ExportFormats
    ) &&
    data.articles &&
    (data.articles as ExportArticle[]).length > 1
  ) {
    ctx.issues.push({
      code: "custom",
      message: "Export format does not support multiple articles",
      input: data,
    });
  }

  if (data.output && typeof data.output === "string") {
    const output = data.output;
    if (
      // If there is no '.' in the output string (aside from first character) this is assumed to be a folder.
      output.slice(1).includes(".") &&
      !Object.keys(EXT_TO_FORMAT).some((ext) => output.endsWith(ext))
    ) {
      ctx.issues.push({
        code: "custom",
        message: "Unknown output format",
        input: data,
      });
    }
  }

  if (data.articles && Array.isArray(data.articles)) {
    if (data.articles.length === 0) {
      delete data.articles;
    } else {
      const hasFile = data.articles.some((article) => {
        if (typeof article === "string") return true;
        return article.file !== undefined;
      });
      if (!hasFile) {
        ctx.issues.push({
          code: "custom",
          message: "At least one article must have a file",
          input: data,
        });
      }
    }
  }

  if (data.toc && typeof data.toc === "string") {
    if (data.tocFile) {
      ctx.issues.push({
        code: "custom",
        message: "Cannot use both `toc` and `tocFile`",
        input: data,
      });
    }
    data.tocFile = data.toc;
    delete data.toc;
  }

  if ((data.toc || data.tocFile) && (data.articles || data.sub_articles)) {
    ctx.issues.push({
      code: "custom",
      message: "Cannot use both `toc` and `articles` or `sub_articles`",
      input: data,
    });
    delete data.toc;
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const exportSchema: ZodType<Export> = z
  .union([
    z.string(),
    z.object({
      id: z.string().optional().describe("identifier for the export"),
      format: exportFormatsSchema.optional().describe("export format"),
      template: z
        .string()
        .optional()
        .nullable()
        .describe("template for the export"),
      output: z.string().optional().describe("output file name"),
      zip: z.boolean().optional().describe("whether to zip the output"),
      toc: z
        .union([z.string(), tocSchema])
        .optional()
        .describe("table of contents for the export"),
      articles: z
        .array(exportArticleSchema)
        .optional()
        .describe("articles for the export"),
      top_level: z
        .enum(["parts", "chapters", "sections"])
        .optional()
        .describe("top level for the export"),
      sub_articles: z
        .array(z.string())
        .optional()
        .describe("sub articles for the export"),
      tocFile: z.string().optional().describe("toc file for the export"),

      // aliases
      article: exportArticleSchema.optional().describe("alias for articles"),
      sub_article: z.string().optional().describe("alias for sub_articles"),
    }),
  ])
  .transform(exportTransform)
  .describe("Export configuration");
