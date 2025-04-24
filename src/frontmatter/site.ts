// SPDX-License-Identifier: MIT

import { z, type ZodType, RefinementCtx } from "zod";

import { type Affiliation, affiliationSchema } from "./affiliations.ts";
import { type Contributor, contributorSchema } from "./contributors.ts";
import { type Funding, fundingSchema } from "./funding.ts";
import { type Venue, venueSchema } from "./venues.ts";
import { type Export, exportSchema } from "./exports.ts";

import { defined } from "simple-validators";

export const PAGE_KNOWN_PARTS = [
  "abstract",
  "summary",
  "keypoints",
  "dedication",
  "epigraph",
  "data_availability",
  "acknowledgments",
] as const;

export const SITE_FRONTMATTER_KEYS = [
  "title",
  "subtitle",
  "short_title",
  "description",
  "thumbnail",
  "thumbnailOptimized",
  "banner",
  "bannerOptimized",
  "tags",
  "authors",
  "reviewers",
  "editors",
  "contributors",
  "venue",
  "github",
  "keywords",
  "affiliations",
  "funding",
  "copyright",
  "options",
  "parts",
  ...PAGE_KNOWN_PARTS,
] as const;

export const FRONTMATTER_ALIASES = {
  author: "authors",
  reviewer: "reviewers",
  editor: "editors",
  contributor: "contributors",
  affiliation: "affiliations",
  export: "exports",
  download: "downloads",
  jupyter: "thebe",
  part: "parts",
  ack: "acknowledgments",
  acknowledgements: "acknowledgments",
  acknowledgment: "acknowledgments",
  acknowledgement: "acknowledgments",
  availability: "data_availability",
  dataAvailability: "data_availability",
  "data-availability": "data_availability",
  quote: "epigraph",
  plain_language_summary: "summary",
  "plain-language-summary": "summary",
  plainLanguageSummary: "summary",
  lay_summary: "summary",
  "lay-summary": "summary",
  keyPoints: "keypoints",
  key_points: "keypoints",
  "key-points": "keypoints",
  image: "thumbnail",
  identifier: "identifiers",
} as const;

export type SiteFrontmatter = {
  title?: string;
  description?: string;
  subtitle?: string;
  short_title?: string;
  thumbnail?: string | null;
  thumbnailOptimized?: string;
  banner?: string | null;
  bannerOptimized?: string;
  authors?: Contributor[];
  tags?: string[];

  // Known parts
  abstract?: string;
  summary?: string;
  keypoints?: string;
  dedication?: string;
  epigraph?: string;
  data_availability?: string;
  acknowledgments?: string;

  /**
   * Reviewers and editors are author/contributor ids.
   * If an object is provided for these fields, it will be moved to contributors
   * and replaced with id reference.
   */
  reviewers?: string[];
  editors?: string[];
  affiliations?: Affiliation[];
  venue?: Venue;
  github?: string;
  keywords?: string[];
  funding?: Funding[];
  copyright?: string;
  contributors?: Contributor[];
  options?: Record<string, unknown>;
  parts?: Record<string, string[]>;
  exports: Export[];
};

const aliasTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  for (const [alias, key] of Object.entries(FRONTMATTER_ALIASES)) {
    if (alias in data) {
      // myst-frontmater just warns on author / authors
      if (
        data[key] !== undefined &&
        key !== "authors" &&
        key !== "affiliations"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate key "${key}"`,
        });
      }
      data[key] = data[alias];
      delete data[alias];
    }
  }

  if (data.authors && !Array.isArray(data.authors)) {
    data.authors = [data.authors];
  }
  if (data.contributors && !Array.isArray(data.contributors)) {
    data.contributors = [data.contributors];
  }
  if (data.exports && !Array.isArray(data.exports)) {
    data.exports = [data.exports];
  }
  if (data.affiliations && !Array.isArray(data.affiliations)) {
    data.affiliations = [data.affiliations];
  }

  if (data.exports) {
    const exportIds = new Set<string>();
    (data.exports as Export[]).forEach((exp) => {
      if (exp.id) {
        if (exportIds.has(exp.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate export id "${exp.id}"`,
          });
        } else {
          exportIds.add(exp.id);
        }
      }
    });
  }

  if (
    data.reviewers &&
    typeof data.reviewers === "object" &&
    "ref" in data.reviewers &&
    typeof data.reviewers.ref === "string"
  ) {
    data.reviewers = [data.reviewers.ref];
  }

  return data;
};

const partsTransform = (data: SiteFrontmatter, ctx: RefinementCtx) => {
  const result: Record<string, unknown> = { ...data };
  const parts: Record<string, string[]> = result.parts
    ? { ...result.parts }
    : {};

  // 1. move known-page-part fields into `parts`
  for (const key of PAGE_KNOWN_PARTS) {
    const val = (result as any)[key];
    if (val !== undefined) {
      // If the key is already in parts, addIssue
      if (parts[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate part key "${key}"`,
        });
      }
      parts[key] = Array.isArray(val) ? val : [val as string];
      delete (result as any)[key];
    }
  }

  // 2. normalize any existing `parts` entries
  for (const [k, v] of Object.entries(parts)) {
    parts[k] = Array.isArray(v) ? v : [v];
  }

  // 3. only set `parts` if we collected anything
  if (Object.keys(parts).length > 0) {
    result.parts = parts;
  } else {
    delete result.parts;
  }

  return result;
};

const githubTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.github)) {
    if (typeof data.github === "string") {
      const GITHUB_USERNAME_REPO_REGEX = "^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$";
      const repo = data.github.match(GITHUB_USERNAME_REPO_REGEX);
      if (repo) {
        data.github = `https://github.com/${repo}`;
      }
      if (!(data.github as string).includes("github")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid github, "${data.github}"`,
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `github must be a string, got ${typeof data.github}`,
      });
    }
  }
  return data;
};

const fundingTransform = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  if (data.funding && !Array.isArray(data.funding)) {
    data.funding = [data.funding];
  }
  return data;
};

const optionsTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (data.options) {
    const disallowedKeys = [
      "format",
      "template",
      "output",
      "id",
      "name",
      "renderer",
      "article",
      "sub_articles",
    ];
    const optionKeys = Object.keys(data.options as object);
    for (const key of optionKeys) {
      if (disallowedKeys.includes(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Attempt to use reserved option "${key}"`,
        });
      }
    }
  }
  return data;
};

export const siteTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
) => {
  const aliasResult = aliasTransform(data, ctx);
  const partsResult = partsTransform(aliasResult as SiteFrontmatter, ctx);
  const githubResult = githubTransform(partsResult, ctx);
  const fundingResult = fundingTransform(githubResult);
  const optionsResult = optionsTransform(fundingResult, ctx);
  return optionsResult;
};

const keywordsTransform = (data: string | string[]) => {
  if (typeof data === "string") {
    if (data.includes(";")) {
      return data.split(";").map((k) => k.trim());
    }
    return data.split(",").map((k) => k.trim());
  }
  if (Array.isArray(data)) {
    return data.map((k) => k.trim());
  }
  return data;
};

// Note: we change the type of `parts` to be a record of string arrays
// @ts-expect-error TS2339
export const siteFrontmatterSchemaBase: ZodType<SiteFrontmatter> = z
  .object({
    title: z.string().optional().describe("Title of the project"),
    description: z.string().optional().describe("Description of the project"),
    subtitle: z.string().optional().describe("Subtitle of the project"),
    short_title: z.string().optional().describe("Short title of the project"),
    thumbnail: z.string().nullable().optional().describe("Thumbnail image URL"),
    thumbnailOptimized: z
      .string()
      .optional()
      .describe("Optimized thumbnail image URL"),
    banner: z.string().nullable().optional().describe("Banner image URL"),
    bannerOptimized: z
      .string()
      .optional()
      .describe("Optimized banner image URL"),
    authors: z
      .union([contributorSchema, z.array(contributorSchema)])
      .optional(),
    tags: z.array(z.string()).optional(),

    abstract: z.string().optional().describe("Abstract of the project"),
    summary: z.string().optional().describe("Summary of the project"),
    keypoints: z.string().optional().describe("Key points of the project"),
    dedication: z.string().optional().describe("Dedication of the project"),
    epigraph: z.string().optional().describe("Epigraph of the project"),
    data_availability: z
      .string()
      .optional()
      .describe("Data availability statement of the project"),
    acknowledgments: z
      .string()
      .optional()
      .describe("Acknowledgments of the project"),

    reviewers: z
      .union([
        contributorSchema,
        z.array(contributorSchema),
        z.object({ ref: z.string() }),
      ])
      .optional(),
    editors: z
      .union([
        contributorSchema,
        z.array(contributorSchema),
        z.object({ ref: z.string() }),
      ])
      .optional(),
    affiliations: z
      .union([affiliationSchema, z.array(affiliationSchema)])
      .optional(),
    venue: venueSchema.optional(),
    github: z.string().optional(),
    keywords: z
      .union([z.string(), z.array(z.string())])
      .optional()
      // @ts-expect-error TS2345
      .transform(keywordsTransform),
    funding: z.union([fundingSchema, z.array(fundingSchema)]).optional(),
    copyright: z.string().optional(),
    contributors: z.array(contributorSchema).optional(),
    options: z.record(z.string(), z.any()).optional(),
    parts: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]))
      .optional()
      .describe("Parts of the project"),
    exports: z
      .union([exportSchema, z.array(exportSchema)])
      .optional()
      .describe("Format exports"),

    // aliases
    author: z.union([contributorSchema, z.array(contributorSchema)]).optional(),
    reviewer: z
      .union([
        contributorSchema,
        z.array(contributorSchema),
        z.object({ ref: z.string() }),
      ])
      .optional(),
    editor: z
      .union([
        contributorSchema,
        z.array(contributorSchema),
        z.object({ ref: z.string() }),
      ])
      .optional(),
    contributor: z
      .union([contributorSchema, z.array(contributorSchema)])
      .optional(),
    affiliation: z
      .union([affiliationSchema, z.array(affiliationSchema)])
      .optional(),
    export: z.union([exportSchema, z.array(exportSchema)]).optional(),
    download: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
    jupyter: z.record(z.string(), z.any()).optional(),
    part: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]))
      .optional()
      .describe("Parts of the project"),
    ack: z.string().optional(),
    acknowledgements: z.string().optional(),
    acknowledgment: z.string().optional(),
    acknowledgement: z.string().optional(),
    availability: z.string().optional(),
    dataAvailability: z.string().optional(),
    "data-availability": z.string().optional(),
    quote: z.string().optional(),
    plain_language_summary: z.string().optional(),
    "plain-language-summary": z.string().optional(),
    plainLanguageSummary: z.string().optional(),
    lay_summary: z.string().optional(),
    "lay-summary": z.string().optional(),
    keyPoints: z.string().optional(),
    key_points: z.string().optional(),
    "key-points": z.string().optional(),
    image: z.string().nullable().optional(),
    identifier: z
      .record(z.string(), z.union([z.string(), z.number()]))
      .optional(),
  })
  .describe("Site frontmatter");

export const siteFrontmatterSchema: ZodType<SiteFrontmatter> =
  siteFrontmatterSchemaBase.superRefine(siteTransform);
