// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod";

import { orcid } from "orcid";

// https://credit.niso.org/
import { credit, type CreditRole } from "credit-roles";
import {
  type Affiliation,
  affiliationSchema,
  affiliationSchemaBase,
  affiliationTransform,
} from "./affiliations.ts";

import { formatName, type Name, parseName } from "./parse-name.ts";

export type ContributorRole = CreditRole | string;
export type { Name };

export type Person = {
  id?: string;
  name?: string | Name; // may be set to Name object
  userId?: string;
  orcid?: string;
  corresponding?: boolean;
  equal_contributor?: boolean;
  deceased?: boolean;
  email?: string;
  roles?: ContributorRole[];
  affiliations?: Affiliation[];
  twitter?: string;
  github?: string;
  url?: string;
  note?: string;
  phone?: string;
  fax?: string;
};

/**
 * Person or Collaboration contributor type
 *
 * After validation, objects of this type are better represented by:
 *
 * `Person | (Affiliation & { collaboration: true })`
 *
 * However, as all the fields are optional and the code must handle cases
 * where everything may be undefined anyway, it's simpler to have a more
 * permissive type.
 */
export type Contributor = Person & Affiliation;

// https://credit.niso.org/
// U+2013 hyphen is used in CRT spec
export const contributorRoleSchema: ZodType<ContributorRole> = z
  .union([
    z.enum([
      "Conceptualization",
      "Data curation",
      "Formal analysis",
      "Funding acquisition",
      "Investigation",
      "Methodology",
      "Project administration",
      "Resources",
      "Software",
      "Supervision",
      "Validation",
      "Visualization",
      "Writing – original draft",
      "Writing – review & editing",
    ]),
    z.string(),
  ])
  .describe("Contributor role");

const nameTransform = (data: string | Name, ctx: RefinementCtx): Name => {
  if (typeof data === "string") {
    data = parseName(data);
    if (!data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid name format",
      });
    }
  }

  if (Object.keys(data).length === 1 && data.literal) {
    data = { ...data, ...parseName(data.literal) };
  } else if (!data.literal) {
    data.literal = formatName(data);
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const nameSchema: ZodType<Name> = z
  .union([
    z.string(),
    z.object({
      literal: z.string().optional(),
      given: z.string().optional(),
      family: z.string().optional(),
      dropping_particle: z.string().optional(),
      non_dropping_particle: z.string().optional(),
      suffix: z.string().optional(),
    }),
  ])
  .transform(nameTransform)
  .describe("Name frontmatter");

const orcidTransform = (data: string, ctx: RefinementCtx) => {
  const id = orcid.normalize(data);
  if (!id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid ORCID ID",
    });
  }
  return id;
};

const personTransform = (
  data: Record<string, unknown>,
  _ctx: RefinementCtx,
): Record<string, unknown> => {
  if (data.roles) {
    if (typeof data.roles === "string") {
      data.roles = data.roles.split(/[,;]/).map((s) => s.trim());
    }
    if (Array.isArray(data.roles)) {
      data.roles = (data.roles as string[]).map((role: string) => {
        const normalizedRole = credit.normalize(role);
        if (normalizedRole) {
          return normalizedRole;
        }
        return role.trim();
      });
    }
  }
  return data;
};

// @ts-ignore: // inconsistent TS2322
export const personSchemaBase: ZodType<Person> = z
  .object({
    id: z.string().optional(),
    name: nameSchema.optional(),
    userId: z.string().optional(),
    orcid: z.string().superRefine(orcidTransform).optional(),
    corresponding: z.boolean().optional(),
    equal_contributor: z.boolean().optional(),
    deceased: z.boolean().optional(),
    email: z.string().email().optional(),
    roles: z.union([z.string(), z.array(contributorRoleSchema)]).optional(),
    affiliations: z
      .union([affiliationSchema, z.array(affiliationSchema)])
      .optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    url: z.string().url().optional(),
    note: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  })
  .describe("Person frontmatter");

export const personSchema: ZodType<Person> = personSchemaBase.superRefine(
  personTransform,
);

const contributorTransform = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx,
) => {
  if (typeof data === "string") {
    return { name: data };
  }

  if (data.corresponding && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Contributor must have an email if corresponding is true",
    });
  }

  const affilationResult = affiliationTransform(data, ctx);
  const personResult = personTransform(affilationResult, ctx);
  return personResult;
};

const contributorPreprocessor = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx,
) => {
  if (typeof data === "object" && typeof data.collaborations !== "undefined") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "collaborations is deprecated, use collaboration instead",
    });
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const contributorSchema: ZodType<Contributor> = z.preprocess(
  // @ts-expect-error TS2322
  contributorPreprocessor,
  z
    .union([
      z.string(),
      // Note: Person `name` overrides Affiliation `name`
      // @ts-expect-error TS2339
      affiliationSchemaBase.merge(personSchemaBase),
    ])
    .superRefine(contributorTransform),
);
