// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type Award = {
  id?: string;
  name?: string;
  description?: string;
  /**
   * Sources are affiliation ids.
   * If an object is provided for this field, it will be moved to affiliations
   * and replaced with id reference.
   */
  sources?: string[]; // These are affiliation ids
  /**
   * Recipients and investigators are author/contributor ids.
   * If an object is provided for these fields, it will be moved to contributors
   * and replaced with id reference.
   */
  recipients?: string[];
  investigators?: string[];
};

export type Funding = {
  statement?: string;
  /** Open access statement */
  open_access?: string;
  awards?: Award[];
};

export const awardSchema: ZodType<Award> = z
  .object({
    id: z.string().optional().describe("identifier for the award"),
    name: z.string().optional().describe("name of the award"),
    description: z.string().optional().describe("description of the award"),
    sources: z.array(z.string()).optional().describe("sources of the award"),
    recipients: z.array(z.string()).optional().describe(
      "recipients of the award",
    ),
    investigators: z.array(z.string()).optional().describe(
      "investigators of the award",
    ),
  })
  .describe("Award");

export const fundingSchema: ZodType<Funding> = z
  .object({
    statement: z.string().optional().describe("statement of the funding"),
    open_access: z.string().optional().describe("open access statement"),
    awards: z
      .array(awardSchema)
      .optional()
      .describe("awards of the funding"),
  })
  .describe("Funding");
