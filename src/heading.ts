// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { phrasingContentSchema } from "./phrasing-content.ts";

export const headingSchema = parentSchema.extend({
  type: z.literal("heading").describe("identifier for node variant"),
  depth: z
    .number()
    .min(1)
    .max(6)
    .describe("heading level; 1-6, inclusive"),
  enumerated: z
    .boolean()
    .optional()
    .describe(
      "count this heading for numbering based on kind, e.g. Section 2.4.1",
    ),
  enumerator: z
    .string()
    .optional()
    .describe("resolved enumerated value for this heading"),
  children: z
    .array(phrasingContentSchema)
    .optional()
    .describe("children of the heading node"),
  identifier: z.string().optional().describe(
    "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
  ),
  label: z.string().optional().describe(
    "node label; character escapes and references are parsed; may be normalized to a unique identifier",
  ),
}).describe("Reference to a url resource");

export type Heading = z.infer<typeof headingSchema>;
