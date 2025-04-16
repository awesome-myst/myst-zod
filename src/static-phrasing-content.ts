// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Text, textSchema } from "./text.ts";
import { type HTML, htmlSchema } from "./html.ts";
import {
  type EmphasisStatic,
  emphasisStaticSchema,
} from "./emphasis-static.ts";
import { type StrongStatic, strongStaticSchema } from "./strong-static.ts";
import { type InlineCode, inlineCodeSchema } from "./inline-code.ts";
import { type Break, breakSchema } from "./break.ts";
import { type Image, imageSchema } from "./image.ts";
import {
  type ImageReference,
  imageReferenceSchema,
} from "./image-reference.ts";
import { type Role, roleSchema } from "./role.ts";
import {
  type SubscriptStatic,
  subscriptStaticSchema,
} from "./subscript-static.ts";
import {
  type SuperscriptStatic,
  superscriptStaticSchema,
} from "./superscript-static.ts";
import {
  type UnderlineStatic,
  underlineStaticSchema,
} from "./underline-static.ts";
import { type InlineMath, inlineMathSchema } from "./inline-math.ts";

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

export const staticPhrasingContentSchema = z.union([
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
