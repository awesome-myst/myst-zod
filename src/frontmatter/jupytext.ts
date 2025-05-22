// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

export type TextRepresentation = {
  extension?: string;
  format_name?: string;
  format_version?: string;
  jupytext_version?: string;
};

export type Jupytext = {
  formats?: string;
  text_representation?: TextRepresentation;
};

export const textRepresentationSchema: ZodType<TextRepresentation> = z
  .object({
    extension: z.string().optional(),
    format_name: z.string().optional(),
    format_version: z.string().optional(),
    jupytext_version: z.string().optional(),
  })
  .describe("Text representation of the notebook");

export const jupytextSchema: ZodType<Jupytext> = z
  .object({
    formats: z.string().optional(),
    text_representation: textRepresentationSchema
      .optional(),
  })
  .describe("Jupytext metadata of the notebook");
