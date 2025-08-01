// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Text, textSchema } from "./phrasing-content/static/text.ts";
import { type HTML, htmlSchema } from "./html.ts";
import {
  type EmphasisStatic,
  emphasisStaticSchema,
} from "./phrasing-content/static/emphasis-static.ts";
import { type StrongStatic, strongStaticSchema } from "./phrasing-content/static/strong-static.ts";
import { type InlineCode, inlineCodeSchema } from "./phrasing-content/static/inline-code.ts";
import { type Break, breakSchema } from "./phrasing-content/static/break.ts";
import { type Image, imageSchema } from "./phrasing-content/static/image.ts";
import {
  type ImageReference,
  imageReferenceSchema,
} from "./phrasing-content/static/image-reference.ts";
import { type Role, roleSchema } from "./phrasing-content/static/role.ts";
import {
  type SubscriptStatic,
  subscriptStaticSchema,
} from "./phrasing-content/static/subscript-static.ts";
import {
  type SuperscriptStatic,
  superscriptStaticSchema,
} from "./phrasing-content/static/superscript-static.ts";
import {
  type UnderlineStatic,
  underlineStaticSchema,
} from "./phrasing-content/static/underline-static.ts";
import { type InlineMath, inlineMathSchema } from "./phrasing-content/static/inline-math.ts";

export type StaticPhrasingContent =
  | Text
  | HTML
  | EmphasisStatic
  | StrongStatic
  | InlineCode
  | Break
  | Image
  | ImageReference
  | Role
  | SubscriptStatic
  | SuperscriptStatic
  | UnderlineStatic
  | InlineMath;

// @ts-expect-error TS2740
export const staticPhrasingContentSchema: ZodType<StaticPhrasingContent> = z
  .discriminatedUnion("type", [
    // @ts-expect-error TS2740
    textSchema,
    htmlSchema,
    emphasisStaticSchema,
    strongStaticSchema,
    inlineCodeSchema,
    breakSchema,
    imageSchema,
    imageReferenceSchema,
    roleSchema,
    subscriptStaticSchema,
    superscriptStaticSchema,
    underlineStaticSchema,
    inlineMathSchema,
  ]);
