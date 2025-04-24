// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

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

export const affiliationSchema: ZodType<Affiliation> = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    institution: z.string().optional(),
    department: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    collaboration: z.boolean().optional(),
    isni: z.string().optional(),
    ringgold: z.number().optional(),
    ror: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  })
  .describe("Affiliation frontmatter");
