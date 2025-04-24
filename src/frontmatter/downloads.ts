// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type ExportFormats, exportFormatsSchema } from "./export-formats.ts";

export type Download = {
  title?: string;
  format?: ExportFormats;
  id?: string;
  url?: string;
  filename?: string;
  static?: boolean;
};

// @ts-expect-error TS2740
export const downloadSchema: ZodType<Download> = z.object({
  title: z.string().optional().describe("title of the download"),
  format: exportFormatsSchema.optional().describe("format of the download"),
  id: z.string().optional().describe("identifier for the download"),
  url: z.string().optional().describe("url for the download"),
  filename: z.string().optional().describe("filename for the download"),
  static: z.boolean().optional().describe("whether the download is static"),
}).describe("Download");
