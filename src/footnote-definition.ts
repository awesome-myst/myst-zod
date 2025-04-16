// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";

export const footnoteDefinitionSchema = parentSchema.extend({
  type: z.literal("footenoteDefinition").describe(
    "identifier for node variant",
  ),
  children: z
    .array(flowContentSchema)
    .optional()
    .describe("children of the footnote definition node"),
  identifier: z.string().optional().describe(
    "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
  ),
  label: z.string().optional().describe(
    "node label; character escapes and references are parsed; may be normalized to a unique identifier",
  ),
}).describe("Rich footnote content associated with footnote reference");

export type FootnoteDefinition = z.infer<typeof footnoteDefinitionSchema>;
