// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const crossReferenceSchema = parentSchema.extend({
  type: z.literal("crossReference").describe("identifier for node variant"),
  kind: z.union([
    z.literal("eq"),
    z.literal("numref"),
    z.literal("ref"),
  ]).describe(
    "Indicates if the references should be numbered.",
  ),
  children: z.array(staticPhrasingContentSchema).optional().describe(
    'Children of the crossReference, can include text with "%s" or "{number}" and enumerated references will be filled in.',
  ),
  identifier: z.string().optional().describe(
    "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
  ),
  label: z.string().optional().describe(
    "node label; character escapes and references are parsed; may be normalized to a unique identifier",
  ),
}).describe("In-line reference to an associated node");

export type CrossReference = z.infer<typeof crossReferenceSchema>;
