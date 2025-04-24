// SPDX-License-Identifier: MIT

import { z, type ZodType, RefinementCtx } from "zod";

export const KNOWN_REFERENCE_KINDS = ["myst", "intersphinx"] as const;

export type ExternalReference = {
  url: string;
  kind?: string;
};

export type ExternalReferences = Record<string, ExternalReference>;

const kindPreprocessor = (data: unknown, ctx: RefinementCtx) => {
  if (typeof data === "string") {
    let result = data.toLowerCase();
    if (result === "sphinx" || result === "inv") {
      return "intersphinx";
    }
    // myst-frontmatter just warns about unknown kinds
    // @ts-expect-error TS2322
    if (!KNOWN_REFERENCE_KINDS.includes(result)) {
      result = "myst";
    }
    return result;
  }
  return data;
};

const externalReferenceTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (typeof data === "string") {
    data = { url: data };
  }
  if ((data.url as string).endsWith("/")) {
    data.url = (data.url as string).slice(0, -1);
  }
  return data;
};

// @ts-expect-error TS2322
export const externalReferenceSchema: ZodType<ExternalReference> = z
  .union([
    z.string(),
    z.object({
      url: z.string().url().describe("URL of the external reference"),
      kind: z.preprocess(
        kindPreprocessor,
        z
          .enum(KNOWN_REFERENCE_KINDS)
          .optional()
          .describe("Kind of the external reference")
      ),
    }),
  ])
  .superRefine(externalReferenceTransform)
  .describe("External reference schema");

export const externalReferencesSchema: ZodType<ExternalReferences> = z
  .record(z.string(), externalReferenceSchema)
  .describe("External references schema");
