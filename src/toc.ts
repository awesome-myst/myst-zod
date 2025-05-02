// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

// Table of contents

/**
 * Common attributes for all TOC items
 * Should be taken as a Partial<>
 */
export type CommonEntry = {
  title?: string;
  // hidden?: boolean;
  // numbering?: string;
  // id?: string;
  // class?: string;
};

/**
 * Entry that groups children, with no associated document
 */
export type ParentEntry = {
  children: Entry[];
  title: string;
} & CommonEntry;

/**
 * Entry with a path to a single document with or without the file extension
 */
export type FileEntry = {
  file: string;
} & CommonEntry;

/**
 * Entry with a path to a single document with or without the file extension,
 * and an array of children
 */
export type FileParentEntry = FileEntry & Omit<ParentEntry, "title">;

/**
 * Entry with a url to an external resource
 */
export type URLEntry = {
  url: string;
} & CommonEntry;

/**
 * Entry with a url to an external resource,
 * and an array of children
 */
export type URLParentEntry = URLEntry & Omit<ParentEntry, "title">;

/**
 * Entry representing several documents through a glob
 */
export type PatternEntry = {
  pattern: string;
} & CommonEntry;

/**
 * All possible types of Entry
 */
export type Entry =
  | FileEntry
  | URLEntry
  | FileParentEntry
  | URLParentEntry
  | PatternEntry
  | ParentEntry;

export type TOC = Entry[];

export const commonEntrySchema: ZodType<CommonEntry> = z.object({
  title: z.string().optional(),
  // hidden: z.boolean().optional(),
  // numbering: z.string().optional(),
  // id: z.string().optional(),
  // class: z.string().optional(),
}).describe("Common attributes for all TOC items");

export const parentEntrySchema: ZodType<ParentEntry> = z.object({
  children: z.array(z.lazy(() => entrySchema)),
  title: z.string(),
}).strict().describe("Entry that groups children, with no associated document");

export const fileEntrySchema: ZodType<FileEntry> =
  // @ts-expect-error TS2339
  commonEntrySchema.extend({
    file: z.string(),
  }).strict().describe(
    "Entry with a path to a single document with or without the file extension",
  );

export const fileParentEntrySchema: ZodType<FileParentEntry> = z.object({
  file: z.string(),
  children: z.array(fileEntrySchema),
}).strict().describe(
  "Entry with a path to a single document with or without the file extension, and an array of children",
);

export const urlEntrySchema: ZodType<URLEntry> =
  // @ts-expect-error TS2339
  commonEntrySchema.extend({
    url: z.string(),
  }).strict().describe("Entry with a url to an external resource");

export const urlParentEntrySchema: ZodType<URLParentEntry> = z.object({
  url: z.string(),
  children: z.array(urlEntrySchema),
}).describe(
  "Entry with a url to an external resource, and an array of children",
);

export const patternEntrySchema: ZodType<PatternEntry> = commonEntrySchema
  // @ts-expect-error TS2339
  .extend({
    pattern: z.string(),
  }).strict().describe("Entry representing several documents through a glob");

export const entrySchema: ZodType<Entry> = z.union([
  fileParentEntrySchema,
  urlParentEntrySchema,
  fileEntrySchema,
  urlEntrySchema,
  patternEntrySchema,
  parentEntrySchema,
]).describe("All possible types of Entry");

export const tocSchema: ZodType<TOC> = z.array(entrySchema)
  .describe("Table of contents");
