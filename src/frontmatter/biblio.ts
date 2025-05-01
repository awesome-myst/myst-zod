// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type PublicationMeta = {
  number?: string | number; // sometimes you'll get fun values like "Spring" and "Inside cover."
  doi?: string;
  title?: string;
  subject?: string;
};

const publicationMetaTransform = (
  data: string | number | Record<string, unknown>,
) => {
  if (typeof data === "number" || typeof data == "string") {
    return { number: data };
  }

  return data;
};

// @ts-expect-error TS2322
export const publicationMetaSchema: ZodType<PublicationMeta> = z.union([
  z.string(),
  z.number(),
  z
    .object({
      number: z.union([z.string(), z.number()]).optional(),
      doi: z.string().optional(),
      title: z.string().optional(),
      subject: z.string().optional(),
    }),
])
  .transform(publicationMetaTransform)
  .describe("Publication meta frontmatter");
