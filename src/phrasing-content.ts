// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";
import { type Emphasis, emphasisSchema } from "./emphasis.ts";
import { type Strong, strongSchema } from "./strong.ts";
import { type Link, linkSchema } from "./link.ts";
import { type LinkReference, linkReferenceSchema } from "./link-reference.ts";
import { type Superscript, superscriptSchema } from "./superscript.ts";
import { type Subscript, subscriptSchema } from "./subscript.ts";
import { type Underline, underlineSchema } from "./underline.ts";
import { type Abbreviation, abbreviationSchema } from "./abbreviation.ts";
import {
  type CrossReference,
  crossReferenceSchema,
} from "./cross-reference.ts";
import {
  type FootnoteReference,
  footnoteReferenceSchema,
} from "./footnote-reference.ts";

export type PhrasingContent =
  | StaticPhrasingContent
  | Emphasis
  | Strong
  | Link
  | LinkReference
  | Subscript
  | Superscript
  | Underline
  | Abbreviation
  | FootnoteReference
  | CrossReference;

export const phrasingContentSchema: ZodType<PhrasingContent> = z
  .discriminatedUnion(
    "type",
    // @ts-expect-error TS2345
    [
      // @ts-expect-error TS2339
      ...staticPhrasingContentSchema.options,
      emphasisSchema,
      strongSchema,
      linkSchema,
      linkReferenceSchema,
      subscriptSchema,
      superscriptSchema,
      underlineSchema,
      abbreviationSchema,
      footnoteReferenceSchema,
      crossReferenceSchema,
    ],
  )
  .describe("Any inline phrasing content");
