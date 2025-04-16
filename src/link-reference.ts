// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const linkReferenceSchema = parentSchema.extend({
  type: z.literal("linkReference").describe("identifier for node variant"),
  children: z
    .array(staticPhrasingContentSchema)
    .describe("static children of the link reference node"),
  referenceType: z.union([
    z.literal("shortcut"),
    z.literal("collapsed"),
    z.literal("full"),
  ]).describe(
    "explicitness of the reference: `shortcut` - reference is implicit, identifier inferred, `collapsed` - reference explicit, identifier inferred, `full` - reference explicit, identifier explicit",
  ),
  identifier: z.string().optional().describe(
    "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
  ),
  label: z.string().optional().describe(
    "node label; character escapes and references are parsed; may be normalized to a unique identifier",
  ),
}).describe("Hyperlink through association");

export type LinkReference = z.infer<typeof linkReferenceSchema>;
