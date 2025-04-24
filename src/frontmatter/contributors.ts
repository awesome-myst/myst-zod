// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

// https://credit.niso.org/
import type { CreditRole } from 'credit-roles';
import { type Affiliation, affiliationSchema } from "./affiliations.ts";

export type ContributorRole = CreditRole | string;

export type Name = {
  literal?: string;
  given?: string;
  family?: string;
  dropping_particle?: string;
  non_dropping_particle?: string;
  suffix?: string;
};

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
  affiliations?: string[];
  twitter?: string;
  github?: string;
  url?: string;
  note?: string;
  phone?: string;
  fax?: string;
  // Computed property; only 'name' should be set in frontmatter as string or Name object
  nameParsed?: Name;
}

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
  .enum(['Conceptualization', 'Data curation', 'Formal analysis', 'Funding acquisition', 'Investigation', 'Methodology', 'Project administration', 'Resources', 'Software', 'Supervision', 'Validation', 'Visualization', 'Writing – original draft', 'Writing – review & editing'])
  .or(z.string())
  .describe("Contributor role");

export const nameSchema: ZodType<Name> = z.object({
  literal: z.string().optional(),
  given: z.string().optional(),
  family: z.string().optional(),
  dropping_particle: z.string().optional(),
  non_dropping_particle: z.string().optional(),
  suffix: z.string().optional(),
}).describe("Name frontmatter");

export const personSchema: ZodType<Person> = z.object({
  id: z.string().optional(),
  name: z.union([z.string(), nameSchema]).optional(),
  userId: z.string().optional(),
  orcid: z.string().optional(),
  corresponding: z.boolean().optional(),
  equal_contributor: z.boolean().optional(),
  deceased: z.boolean().optional(),
  email: z.string().email().optional(),
  roles: z.array(contributorRoleSchema).optional(),
  affiliations: z.array(z.string()).optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  url: z.string().url().optional(),
  note: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
}).describe("Person frontmatter");

export const contributorSchema: ZodType<Contributor> = personSchema.extend(affiliationSchema)