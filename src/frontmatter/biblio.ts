// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type PublicationMeta = {
  number?: string | number; // sometimes you'll get fun values like "Spring" and "Inside cover."
  doi?: string;
  title?: string;
  subject?: string;
};

export const publicationMetaSchema: ZodType<PublicationMeta> = z
  .object({
    number: z.union([z.string(), z.number()]).optional(),
    doi: z.string().optional(),
    title: z.string().optional(),
    subject: z.string().optional(),
  })
  .describe("Publication meta frontmatter");
