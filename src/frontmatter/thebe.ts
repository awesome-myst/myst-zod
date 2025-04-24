// SPDX-License-Identifier: MIT

import { z, type ZodType, RefinementCtx } from "zod";

import { defined } from "simple-validators";

export type ThebeFrontmatter = boolean | string | ThebeFrontmatterObject;

export type JupyterServerOptions = {
  url: string;
  token: string;
};

export type WellKnownRepoProviders = "github" | "gitlab" | "git" | "gist";
export type BinderProviders = WellKnownRepoProviders | string;

export type BinderHubOptions = {
  url?: string;
  ref?: string; // org-name/repo-name for WellKnownRepoProviders, url for 'meca', otherwise any string
  repo?: string;
  provider?: BinderProviders;
};

export type ThebeFrontmatterObject = {
  lite?: boolean;
  binder?: boolean | BinderHubOptions;
  server?: JupyterServerOptions;
  kernelName?: string;
  sessionName?: string;
  disableSessionSaving?: boolean;
  mathjaxUrl?: string;
  mathjaxConfig?: string;
};

// NOTE: currently a subtle difference but will likely grow with lite options
export type ExpandedThebeFrontmatter =
  & Omit<ThebeFrontmatterObject, "binder">
  & {
    binder?: BinderHubOptions;
  };


export const wellKnownRepoProvidersSchema: ZodType<WellKnownRepoProviders> = z
  .enum([
    "github",
    "gitlab",
    "git",
    "gist",
  ]);

export const binderProvidersSchema: ZodType<BinderProviders> = z.union([
  wellKnownRepoProvidersSchema,
  z.string(),
]);

export const bunderHubOptionsSchema: ZodType<BinderHubOptions> = z.object({
  url: z
    .string()
    .url()
    .optional()
    .describe("BinderHub URL"),
  ref: z
    .string()
    .optional()
    .describe("BinderHub reference"),
  repo: z
    .string()
    .optional()
    .describe("BinderHub repo"),
  provider: binderProvidersSchema
    .optional()
    .describe("Binder provider"),
}).describe("BinderHub options");

export const jupyterServerOptionsSchema: ZodType<JupyterServerOptions> = z
  .object({
    url: z
      .string()
      .url()
      .describe("Jupyter server URL"),
    token: z
      .string()
      .describe("Jupyter server token"),
  }).describe("Jupyter server options");

export const thebeFrontmatterObjectSchema: ZodType<ThebeFrontmatterObject> = z
  .object({
    lite: z
      .boolean()
      .optional()
      .describe("Enable thebe lite"),
    binder: z
      .union([z.boolean(), bunderHubOptionsSchema])
      .optional()
      .describe("BinderHub options"),
    server: jupyterServerOptionsSchema
      .optional()
      .describe("Jupyter server options"),
    kernelName: z
      .string()
      .optional()
      .describe("Kernel name"),
    sessionName: z
      .string()
      .optional()
      .describe("Session name"),
    disableSessionSaving: z
      .boolean()
      .optional()
      .describe("Disable session saving"),
    mathjaxUrl: z
      .string()
      .optional()
      .describe("MathJax URL"),
    mathjaxConfig: z
      .string()
      .optional()
      .describe("MathJax config"),
  }).describe("Thebe frontmatter options");

const thebeTransform = (
  data: string | boolean | Record<string, unknown>,
  ctx: RefinementCtx
) => {
  if (typeof data === "boolean" || typeof data === "string") {
    if (data === true) {
      data = { binder: true };
    } else if (data === "lite") {
      data = { lite: true };
    } else if (data === "binder") {
      data = { binder: true };
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Thebe frontmatter must be a boolean, an object, "lite" or "binder", not a string: ${data}`,
      });
      return z.NEVER;
    }
  }

  if ('binder' in data && data.binder === true) {
    data.binder = { url: "https://mybinder.org" };
  } else if (typeof data.binder === "string") {
    data.binder = { url: data.binder };
  }

  if ('binder' in data && typeof data.binder === 'object' && data.binder !== null) {
    const binder = data.binder as BinderHubOptions;
    if (binder.provider === "custom" && binder.repo === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `BinderHub options must include a repo when using a custom provider`,
      });
    }
  }

  if ('server' in data && typeof data.server === 'object' && data.server !== null) {
    const server = data.server as JupyterServerOptions;
  }

  return data;
};

export const thebeFrontmatterSchema: ZodType<ThebeFrontmatter> = z
  .union([
    z.boolean().describe("Enable thebe"),
    z.string().describe("Thebe frontmatter string"),
    thebeFrontmatterObjectSchema,
  ])
  .superRefine(thebeTransform)
  .describe("Thebe frontmatter");