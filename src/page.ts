// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";
import {
  type PageFrontmatter,
  pageFrontmatterSchema,
} from "./frontmatter/page.ts";
import { type Root, rootSchema } from "./root.ts";

export type Citations = {
  order: string[];
  data: Record<
    string,
    {
      label: string;
      html: string;
      enumerator: string;
      doi?: string;
      url?: string;
    }
  >;
};

export type References = {
  cite?: Citations;
};

export enum SourceFileKind {
  Article = "Article",
  Notebook = "Notebook",
  Part = "Part",
}

export type Dependency = {
  url?: string;
  slug?: string;
  kind?: SourceFileKind;
  title?: string;
  short_title?: string;
  label?: string;
  location?: string;
  remoteBaseUrl?: string;
};

export const dependencySchema: ZodType<Dependency> = z.object({
  url: z.string().optional(),
  slug: z.string().optional(),
  kind: z.nativeEnum(SourceFileKind).optional(),
  title: z.string().optional(),
  short_title: z.string().optional(),
  label: z.string().optional(),
  location: z.string().optional(),
  remoteBaseUrl: z.string().optional(),
});

export type Page = {
  version: number;
  kind: SourceFileKind;
  sha256: string;
  slug: string;
  location: string;
  dependencies: Dependency[];
  frontmatter: PageFrontmatter;
  mdast: Root;
  references: References;
};

export const pageSchema: ZodType<Page> = z
  .object({
    version: z.number().min(1).int().describe("Version of the page schema"),
    kind: z.nativeEnum(SourceFileKind).describe("Kind of the page"),
    sha256: z.string().describe("SHA256 hash of the page content"),
    slug: z.string().describe("URL slug for the page"),
    location: z.string().describe("File location of the page"),
    dependencies: z
      .array(dependencySchema)
      .describe("Dependencies of the page"),
    frontmatter: pageFrontmatterSchema.describe("Frontmatter of the page"),
    mdast: rootSchema.describe("MDAST of the page"),
    references: z
      .object({
        cite: z
          .object({
            order: z.array(z.string()).describe("Order of citations"),
            data: z
              .record(
                z.string(),
                z.object({
                  label: z.string().describe("Label for the citation"),
                  html: z
                    .string()
                    .describe("HTML representation of the citation"),
                  enumerator: z
                    .string()
                    .describe("Enumerator for the citation"),
                  doi: z.string().describe("DOI for the citation").optional(),
                  url: z.string().describe("URL for the citation").optional(),
                }),
              )
              .describe("Data for the citations"),
          })
          .describe("Citations for the page"),
      })
      .describe("References for the page"),
  })
  .describe("Page schema for MyST documents");
