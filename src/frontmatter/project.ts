// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

import { doi } from "doi-utils";

// Match date validation and formatting in myst-formatter
import {
  defined,
  validateDate,
  type ValidationOptions,
} from "simple-validators";

// Match license validation in myst-formatter
import { validateLicense } from "./licenses-vendor/validators.ts";

import { type PublicationMeta, publicationMetaSchema } from "./biblio.ts";
import { type Download, downloadSchema } from "./downloads.ts";
import { type Export, exportSchema } from "./exports.ts";
import { type License, type Licenses, licensesSchema } from "./licenses.ts";
import { type MathMacro, mathMacroSchema } from "./math.ts";
import { type Numbering, numberingSchema } from "./numbering.ts";
import {
  type ExternalReferences,
  externalReferencesSchema,
} from "./references.ts";
import { type ProjectSettings, projectSettingsSchema } from "./settings.ts";
import {
  SITE_FRONTMATTER_KEYS,
  type SiteFrontmatter,
  siteFrontmatterSchemaBase,
  siteTransform,
} from "./site.ts";
import {
  type ExpandedThebeFrontmatter,
  thebeFrontmatterSchema,
} from "./thebe.ts";
import { type TOC, tocSchema } from "../toc.ts";

export const KNOWN_EXTERNAL_IDENTIFIERS = [
  "arxiv",
  "pmid",
  "pmcid",
  "zenodo",
] as const;

export const PROJECT_AND_PAGE_FRONTMATTER_KEYS = [
  "date",
  "doi",
  "identifiers",
  "open_access",
  "license",
  "binder",
  "source",
  "subject",
  "volume",
  "issue",
  "first_page",
  "last_page",
  "oxa",
  "numbering",
  "bibliography",
  "math",
  "abbreviations",
  "exports",
  "downloads",
  "settings", // We maybe want to move this into site frontmatter in the future
  "edit_url",
  ...KNOWN_EXTERNAL_IDENTIFIERS,
  // Do not add any project specific keys here!
  ...SITE_FRONTMATTER_KEYS,
] as const;

export const PROJECT_FRONTMATTER_KEYS = [
  ...PROJECT_AND_PAGE_FRONTMATTER_KEYS,
  // These keys only exist on the project
  "id",
  "references",
  "requirements",
  "resources",
  "thebe",
  "toc",
] as const;

export type ProjectAndPageFrontmatter = SiteFrontmatter & {
  date?: string;
  doi?: string;
  identifiers?: Record<string, string | number>;
  open_access?: boolean;
  license?: Licenses;
  binder?: string;
  source?: string;
  subject?: string;
  /** Links to bib files for citations */
  bibliography?: string[];
  volume?: PublicationMeta;
  issue?: PublicationMeta;
  first_page?: string | number;
  last_page?: string | number;
  oxa?: string;
  numbering?: Numbering;
  /** Math macros to be passed to KaTeX or LaTeX */
  math?: Record<string, MathMacro>;
  /** Abbreviations used throughout the project */
  abbreviations?: Record<string, string | null>;
  exports?: Export[];
  downloads?: Download[];
  settings?: ProjectSettings;
  edit_url?: string | null;
};

export type ProjectFrontmatter = ProjectAndPageFrontmatter & {
  id?: string;
  /** Intersphinx and MyST cross-project references */
  references?: ExternalReferences;
  requirements?: string[];
  resources?: string[];
  thebe?: ExpandedThebeFrontmatter;
  toc?: TOC[];
};

export const dateTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.date)) {
    const opts: ValidationOptions = {
      property: "date",
      messages: {},
      errorLogFn: (msg) => {
        ctx.issues.push({
          code: "custom",
          message: msg,
          input: data,
        });
      },
    };

    data.date = validateDate(data.date, opts);
  }
  return data;
};

export const licenseTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.license)) {
    const opts: ValidationOptions = {
      property: "license",
      messages: {},
      errorLogFn: (msg) => {
        ctx.issues.push({
          code: "custom",
          message: msg,
          input: data,
        });
      },
    };

    data.license = validateLicense(data.license as License, opts);
  }
  return data;
};

const identifiersTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  // move known external identifiers into the identifiers object
  for (const key of KNOWN_EXTERNAL_IDENTIFIERS) {
    if (data[key] !== undefined) {
      if (data.identifiers === undefined) {
        data.identifiers = {};
      }
      // @ts-expect-error TS2339
      if (data.identifiers[key] !== undefined) {
        ctx.issues.push({
          code: "custom",
          message: `Duplicate identifier key "${key}"`,
          input: data,
        });
      }
      // @ts-expect-error TS2339
      data.identifiers[key] = data[key];
      delete data[key];
    }
  }

  if (
    defined(data.identifiers) &&
    defined((data.identifiers as Record<string, unknown>).doi)
  ) {
    if (defined(data.doi)) {
      ctx.issues.push({
        code: "custom",
        message: `Duplicate DOI key "doi"`,
        input: data,
      });
    }
    data.doi = (data.identifiers as Record<string, unknown>).doi;
    delete (data.identifiers as Record<string, unknown>).doi;
  }

  if (data.identifiers) {
    const identifiers = data.identifiers as Record<string, string | number>;
    if (
      "arxiv" in identifiers &&
      (typeof identifiers.arxiv !== "string" ||
        !identifiers.arxiv.includes("arxiv.org"))
    ) {
      ctx.issues.push({
        code: "custom",
        message: `Invalid arXiv ID "${identifiers.arxiv}"`,
        input: data,
      });
    }
    if ("pmid" in identifiers && typeof identifiers.pmid === "string") {
      identifiers.pmid = parseInt(identifiers.pmid, 10);
      if (isNaN(identifiers.pmid)) {
        ctx.issues.push({
          code: "custom",
          message: `Invalid PubMed ID "${identifiers.pmid}"`,
          input: data,
        });
      }
      // @ts-expect-error TS2339
      data.identifiers.pmid = identifiers.pmid;
    }
    if (
      "pmid" in identifiers &&
      (typeof identifiers.pmid !== "number" ||
        !Number.isInteger(identifiers.pmid) ||
        identifiers.pmid < 2 ||
        identifiers.pmid > 99999999)
    ) {
      ctx.issues.push({
        code: "custom",
        message: `Invalid PubMed ID "${identifiers.pmid}"`,
        input: data,
      });
    }
    if (
      "pmcid" in identifiers &&
      (typeof identifiers.pmcid !== "string" ||
        !identifiers.pmcid.match(/^PMC\d+$/))
    ) {
      ctx.issues.push({
        code: "custom",
        message: `Invalid PubMed Central ID "${identifiers.pmcid}"`,
        input: data,
      });
    }
    if (
      "zenodo" in identifiers &&
      (typeof identifiers.zenodo !== "string" ||
        !identifiers.zenodo.includes("zenodo.org"))
    ) {
      ctx.issues.push({
        code: "custom",
        message: `Invalid Zenodo ID "${identifiers.zenodo}"`,
        input: data,
      });
    }
  }
  return data;
};

const doiTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.doi)) {
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
  return data;
};

const abbreviationsTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.abbreviations)) {
    if (typeof data.abbreviations !== "object") {
      ctx.issues.push({
        code: "custom",
        message: `Abbreviations must be an object, got ${typeof data.abbreviations}`,
        input: data,
      });
    } else {
      const abbreviations = data.abbreviations as Record<string, unknown>;
      for (const key in abbreviations) {
        if (typeof abbreviations[key] === "boolean") {
          abbreviations[key] = null;
        } else if (typeof abbreviations[key] === "string") {
          if (key.length < 2) {
            ctx.issues.push({
              code: "custom",
              message: `Abbreviations must be two characters or more, got "${abbreviations[key]}"`,
              input: data,
            });
          }
        }
      }
      data.abbreviations = abbreviations;
    }
  }
  return data;
};

const downloadsTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.downloads)) {
    if (!Array.isArray(data.downloads)) {
      data.downloads = [data.downloads];
    }
    let hasId = false;
    let hasUrl = false;
    const downloads = data.downloads as Download[];
    for (const download of downloads) {
      if (defined(download.id)) {
        if (hasId) {
          ctx.issues.push({
            code: "custom",
            message: `Duplicate download id "${download.id}"`,
            input: data,
          });
        }
        hasId = true;
      }
      if (defined(download.url)) {
        if (hasUrl) {
          ctx.issues.push({
            code: "custom",
            message: `Duplicate download url "${download.url}"`,
            input: data,
          });
        }
        hasUrl = true;
      }
    }
  }
  return data;
};

const thebeTransform = (data: Record<string, unknown>, ctx: RefinementCtx) => {
  if (defined(data.jupyter)) {
    if (data.thebe !== undefined) {
      ctx.issues.push({
        code: "custom",
        message: `Duplicate thebe key "jupyter"`,
        input: data,
      });
    }
    data.thebe = data.jupyter;
    delete data.jupyter;
  }

  return data;
};

const referencesTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  if (defined(data.references)) {
    if (typeof data.references !== "object") {
      ctx.issues.push({
        code: "custom",
        message: `References must be an object, got ${typeof data.references}`,
        input: data,
      });
    } else {
      const references = data.references as ExternalReferences;
      for (const key in references) {
        if (!key.match(/^[a-zA-Z0-9_-]*$/)) {
          ctx.issues.push({
            code: "custom",
            message: `Invalid reference key "${key}"`,
            input: data,
          });
        }
      }
    }
  }
  return data;
};

export const projectAndPageTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx
): Record<string, unknown> => {
  const siteResult = siteTransform(data, ctx);
  const dateResult = dateTransform(siteResult, ctx);
  const licenceResult = licenseTransform(dateResult, ctx);
  const abbreviationsResult = abbreviationsTransform(licenceResult, ctx);
  const identifiersResult = identifiersTransform(abbreviationsResult, ctx);
  const doiResult = doiTransform(identifiersResult, ctx);
  const downloadsResult = downloadsTransform(doiResult, ctx);
  const thebeResult = thebeTransform(downloadsResult, ctx);
  const referencesResult = referencesTransform(thebeResult, ctx);
  return referencesResult;
};

export const projectAndPageFrontmatterSchemaBase: ZodType<ProjectAndPageFrontmatter> =
  siteFrontmatterSchemaBase
    // @ts-expect-error TS2339
    .extend({
      date: z.string().optional().describe("Date of the project"),
      doi: z.string().optional().describe("DOI of the project"),
      identifiers: z
        .record(z.string(), z.union([z.string(), z.number()]))
        .optional()
        .describe("Identifiers of the project"),
      open_access: z.boolean().optional().describe("Open access status"),
      license: z
        .union([z.string(), licensesSchema])
        .optional()
        .describe("License of the project"),
      binder: z.string().optional().describe("Binder URL"),
      source: z.string().optional().describe("Source code URL"),
      subject: z.string().optional().describe("Subject of the project"),
      volume: publicationMetaSchema
        .optional()
        .describe("Volume of the project"),
      issue: publicationMetaSchema.optional().describe("Issue of the project"),
      first_page: z
        .union([z.string(), z.number()])
        .optional()
        .describe("First page of the project"),
      last_page: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Last page of the project"),
      oxa: z.string().optional().describe("OXA ID of the project"),
      numbering: numberingSchema
        .optional()
        .describe("Numbering scheme for the project"),
      bibliography: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .describe("Bibliography files for the project"),
      math: z
        .record(z.string(), mathMacroSchema)
        .optional()
        .describe("Math macros for the project"),
      abbreviations: z
        .record(z.string(), z.union([z.string(), z.boolean(), z.null()]))
        .optional()
        .describe("Abbreviations used in the project"),
      exports: z
        .union([exportSchema, exportSchema.array()])
        .optional()
        .describe("Exports for the project"),
      downloads: downloadSchema
        .array()
        .optional()
        .describe("Downloads for the project"),
      settings: projectSettingsSchema.optional().describe("Project settings"),
      edit_url: z
        .string()
        .optional()
        .nullable()
        .describe("Edit URL for the project"),
      arxiv: z.string().optional().describe("arXiv ID of the project"),
      pmid: z
        .union([z.string(), z.number()])
        .optional()
        .describe("PMID of the project"),
      pmcid: z.string().optional().describe("PMCID of the project"),
      zenodo: z.string().optional().describe("Zenodo ID of the project"),
    })
    .describe(
      "Project and page frontmatter. This is a superset of site frontmatter, and should be used in all projects."
    );

export const projectAndPageFrontmatterSchema: ZodType<ProjectAndPageFrontmatter> =
  projectAndPageFrontmatterSchemaBase.transform(projectAndPageTransform);

export const projectFrontmatterSchemaBase: ZodType<ProjectFrontmatter> =
  projectAndPageFrontmatterSchemaBase
    // @ts-expect-error TS2339
    .extend({
      id: z.string().optional().describe("ID of the project"),
      references: externalReferencesSchema
        .optional()
        .describe("References for the project"),
      requirements: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .describe("Requirements for the project"),
      resources: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .describe("Resources for the project"),
      thebe: thebeFrontmatterSchema
        .optional()
        .describe("Thebe frontmatter for the project"),
      toc: tocSchema.optional().describe("Table of contents for the project"),

      // aliases
      jupyter: thebeFrontmatterSchema
        .optional()
        .describe("Thebe frontmatter for the project"),
    })
    .describe(
      "Project frontmatter. This is a superset of site frontmatter, and should be used in all projects."
    );

export const projectFrontmatterSchema: ZodType<ProjectFrontmatter> =
  projectFrontmatterSchemaBase.transform(projectAndPageTransform);
