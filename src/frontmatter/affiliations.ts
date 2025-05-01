// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod";

import { doi } from "doi-utils";

export const AFFILIATION_ALIASES = {
  ref: "id", // Used in QMD to reference an affiliation
  region: "state",
  province: "state",
  zipcode: "postal_code",
  zip_code: "postal_code",
  website: "url",
  institution: "name",
} as const;

export type Affiliation = {
  id?: string;
  name?: string; // by default required but if only institution is provided, it's ok
  institution?: string;
  department?: string;
  address?: string;
  city?: string;
  state?: string; // or region or province
  postal_code?: string;
  country?: string;
  collaboration?: boolean;
  isni?: string;
  ringgold?: number;
  ror?: string;
  doi?: string;
  url?: string;
  email?: string;
  phone?: string;
  fax?: string;
};

export const affiliationTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx,
): Record<string, unknown> => {
  if (typeof data === "string") {
    return { name: data };
  }

  for (const [alias, key] of Object.entries(AFFILIATION_ALIASES)) {
    if (alias in data) {
      if (data[key] !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate key "${key}"`,
        });
      }
      data[key] = data[alias];
      delete data[alias];
    }
  }

  if (data.doi) {
    if (typeof data.doi === "string") {
      if (!doi.validate(data.doi, { strict: true })) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid DOI "${data.doi}"`,
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `DOI must be a string, got ${typeof data.doi}`,
      });
    }
  }

  if (data.postal_code && typeof data.postal_code === "number") {
    data.postal_code = data.postal_code.toString();
  }

  return data;
};

// @ts-expect-error TS2339
export const affiliationSchemaBase: ZodType<Affiliation> = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    institution: z.string().optional(),
    department: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.union([z.number(), z.string()]).optional(),
    country: z.string().optional(),
    collaboration: z.boolean().optional(),
    isni: z.string().optional(),
    ringgold: z.number().min(1000).max(999999).optional(),
    ror: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),

    // aliases
    ref: z.string().optional(),
    region: z.string().optional(),
    province: z.string().optional(),
    zipcode: z.string().optional(),
    zip_code: z.string().optional(),
    website: z.string().url().optional(),
  })
  .describe("Affiliation frontmatter");

// @ts-expect-error TS2339
export const affiliationSchema: ZodType<Affiliation> = z.union([
  z.string(),
  affiliationSchemaBase.superRefine(affiliationTransform),
]);
