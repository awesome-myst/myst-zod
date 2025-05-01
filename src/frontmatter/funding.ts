// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

const AWARD_ALIASES = {
  source: "sources",
  recipient: "recipients",
  investigator: "investigators",
};
const FUNDING_ALIASES = { award: "awards" };

/**
 * We do not yet implement all the fancy normalization myst-frontmatter does,
 * which will require preprocessing on the site level.
 */
export type Award = {
  id?: string;
  name?: string;
  description?: string;
  sources?: string[]; // These are affiliation ids
  recipients?: string[];
  investigators?: string[];
};

export type Funding = {
  statement?: string;
  /** Open access statement */
  open_access?: string;
  awards?: Award[];
};

/**
 * Award sources (institutions) get added to affiliations list and
 * award recipients/investigators get added to authors list.
 */
const awardTransform = (
  data: Record<string, unknown>,
  ctx: z.RefinementCtx,
): Record<string, unknown> => {
  for (const [alias, key] of Object.entries(AWARD_ALIASES)) {
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

  if (
    Array.isArray(data.recipients) && data.recipients.length > 0 &&
    typeof data.recipients[0] === "object" && data.recipients[0] !== null
  ) {
    const recipientObj = data.recipients[0] as Record<string, unknown>;
    if (typeof recipientObj.name === "string") {
      data.recipients = [recipientObj.name];
    }
  }

  if (
    Array.isArray(data.investigators) && data.investigators.length > 0 &&
    typeof data.investigators[0] === "object" && data.investigators[0] !== null
  ) {
    const investigatorsObj = data.investigators[0] as Record<string, unknown>;
    if (typeof investigatorsObj.name === "string") {
      data.investigators = [investigatorsObj.name];
    }
  }

  return data;
};

// @ts-expect-error TS2322
export const awardSchema: ZodType<Award> = z
  .object({
    id: z.string().optional().describe("identifier for the award"),
    name: z.string().optional().describe("name of the award"),
    description: z.string().optional().describe("description of the award"),
    sources: z.array(z.string()).optional().describe("sources of the award"),
    recipients: z.union([
      z.array(z.record(z.string(), z.string())),
      z.array(z.string()),
    ])
      .optional()
      .describe("recipients of the award"),
    investigators: z.union([
      z.array(z.record(z.string(), z.string())),
      z.array(z.string()),
    ])
      .optional()
      .describe("investigators of the award"),
  })
  .transform(awardTransform)
  .describe("Award");

const fundingTransform = (
  data: string | Record<string, unknown>,
  ctx: z.RefinementCtx,
): Record<string, unknown> => {
  if (typeof data === "string") {
    return { statement: data };
  }

  for (const [alias, key] of Object.entries(FUNDING_ALIASES)) {
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

  if ("awards" in data) {
    if (!Array.isArray(data["awards"])) {
      data["awards"] = [data["awards"]];
    }
  }

  return data;
};

// @ts-expect-error TS2339
export const fundingSchema: ZodType<Funding> = z
  .union([
    z.string(),
    z.object({
      statement: z.string().optional().describe("statement of the funding"),
      open_access: z.string().optional().describe("open access statement"),
      awards: z.union([awardSchema, z.array(awardSchema)]).optional().describe(
        "awards of the funding",
      ),

      // Aliases
      award: z.union([awardSchema, z.array(awardSchema)]).optional(),
    }),
  ])
  .transform(fundingTransform)
  .describe("Funding");
