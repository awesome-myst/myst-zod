// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

import { doi } from "doi-utils";
import type { SocialLinks } from "./social-links.ts";
import { socialLinksTransform } from "./social-links.ts";

export const AFFILIATION_ALIASES = {
  ref: "id", // Used in QMD to reference an affiliation
  region: "state",
  province: "state",
  zipcode: "postal_code",
  zip_code: "postal_code",
  website: "url",
  institution: "name",
} as const;

export type Affiliation = SocialLinks & {
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
  email?: string;
  phone?: string;
  fax?: string;
};

export const affiliationTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (typeof data === "string") {
    return { name: data };
  }

  // Handle social links aliases and duplicates
  data = socialLinksTransform(data, ctx);

  for (const [alias, key] of Object.entries(AFFILIATION_ALIASES)) {
    if (alias in data) {
      if (data[key] !== undefined) {
        ctx.issues.push({
          code: "custom",
          message: `Duplicate key "${key}"`,
          input: data,
        });
      }
      data[key] = data[alias];
      delete data[alias];
    }
  }

  console.log("data.doi", data.doi);
  console.log("data", data);
  console.log("ctx.value", ctx.value);
  if (data.doi) {
    if (typeof data.doi === "string") {
      if (!doi.validate(data.doi, { strict: true })) {
        ctx.issues.push({
          code: "custom",
          message: `Invalid DOI "${data.doi}"`,
          input: data,
        });
      }
    } else {
      ctx.issues.push({
        code: "custom",
        message: `DOI must be a string, got ${typeof data.doi}`,
        input: data,
      });
    }
  }

  if (data.postal_code && typeof data.postal_code === "number") {
    data.postal_code = data.postal_code.toString();
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
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
    url: z.url().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),

    // Social links
    github: z.string().optional(),
    bluesky: z.string().optional(),
    mastodon: z.string().optional(),
    linkedin: z.string().optional(),
    threads: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    discourse: z.string().optional(),
    discord: z.string().optional(),
    slack: z.string().optional(),
    facebook: z.string().optional(),
    telegram: z.string().optional(),

    // Social links aliases
    website: z.string().url().optional(),
    x: z.string().optional(),
    bsky: z.string().optional(),
    instagram: z.string().optional(),

    // Other aliases
    ref: z.string().optional(),
    region: z.string().optional(),
    province: z.string().optional(),
    zipcode: z.string().optional(),
    zip_code: z.string().optional(),
  })
  .describe("Affiliation frontmatter");

// @ts-ignore: // inconsistent TS2322
export const affiliationSchema: ZodType<Affiliation> =
  affiliationSchemaBase.transform(affiliationTransform);
