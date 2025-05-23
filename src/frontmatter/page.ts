// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Jupytext, jupytextSchema } from "./jupytext.ts";
import { type KernelSpec, kernelSpecSchema } from "./kernelspec.ts";
import {
  PROJECT_AND_PAGE_FRONTMATTER_KEYS,
  type ProjectAndPageFrontmatter,
  projectAndPageFrontmatterSchemaBase,
  projectAndPageTransform,
} from "./project.ts";

export const PAGE_FRONTMATTER_KEYS = [
  ...PROJECT_AND_PAGE_FRONTMATTER_KEYS,
  // These keys only exist on the page
  "label",
  "kernelspec",
  "jupytext",
  "tags",
  "site",
  "enumerator",
  "content_includes_title",
  "skip_execution",
] as const;

export type PageFrontmatter = ProjectAndPageFrontmatter & {
  label?: string;
  kernelspec?: KernelSpec;
  jupytext?: Jupytext;
  tags?: string[];
  enumerator?: string;
  // Disable execution for this page
  skip_execution?: boolean;
  /** Flag if frontmatter title is duplicated in content
   *
   * Set during initial file/frontmatter load
   */
  content_includes_title?: boolean;
  /** Site Options, for example for turning off the outline on a single page */
  site?: Record<string, unknown>;
};

export const pageFrontmatterSchemaBase: ZodType<PageFrontmatter> =
  projectAndPageFrontmatterSchemaBase
    // @ts-expect-error TS2339
    .extend({
      label: z.string().optional().describe("Label for the page"),
      kernelspec: kernelSpecSchema.optional(),
      jupytext: jupytextSchema.optional(),
      tags: z.array(z.string()).optional().describe("Tags for the page"),
      enumerator: z.string().optional().describe("Enumerator for the page"),
      skip_execution: z
        .boolean()
        .optional()
        .describe("Skip execution for this page"),
      content_includes_title: z
        .boolean()
        .optional()
        .describe("Flag if frontmatter title is duplicated in content"),
      site: z
        .record(z.string(), z.any())
        .optional()
        .describe("Site options for this page"),
    })
    .describe("Frontmatter for a page");

export const pageFrontmatterSchema: ZodType<PageFrontmatter> =
  pageFrontmatterSchemaBase.transform(projectAndPageTransform);
