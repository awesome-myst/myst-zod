// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

import { type ExportFormats, exportFormatsSchema } from "./exports.ts";

export type Download = {
  title?: string;
  format?: ExportFormats;
  id?: string;
  url?: string;
  filename?: string;
  static?: boolean;
};

const downloadTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
) => {
  if (typeof data === "string") {
    return { url: data };
  }

  if (data.ref) {
    if (data.id) {
      ctx.issues.push({
        code: "custom",
        message: "download must define only one of id and ref, not both",
        input: data,
      });
    }
    data.id = data.ref;
    delete data.ref;
  }
  if (data.file) {
    if (data.url) {
      ctx.issues.push({
        code: "custom",
        message: "download must define only one of id and file/url, not both",
        input: data,
      });
    }
    data.url = data.file;
    delete data.file;
  }

  if (data.url && data.id) {
    ctx.issues.push({
      code: "custom",
      message: "download must define only one of id and file/url, not both",
      input: data,
    });
  }
  if (!data.url && !data.id) {
    ctx.issues.push({
      code: "custom",
      message: "download must define either id or file/url",
      input: data,
    });
  }
  return data;
};

// @ts-ignore: // inconsistent TS2322
export const downloadSchema: ZodType<Download> = z
  .union([
    z.string(),
    z.object({
      title: z.string().optional().describe("title of the download"),
      format: exportFormatsSchema.optional().describe("format of the download"),
      id: z.string().optional().describe("identifier for the download"),
      url: z.string().optional().describe("url for the download"),
      filename: z.string().optional().describe("filename for the download"),
      static: z.boolean().optional().describe("whether the download is static"),

      // aliases
      ref: z.string().optional().describe("alias for id"),
      file: z.string().optional().describe("alias for url"),
    }),
  ])
  .transform(downloadTransform)
  .describe("Download");
