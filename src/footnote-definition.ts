// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { parentSchema, type Parent } from "./parent.ts";
import { flowContentSchema, type FlowContent } from "./flow-content.ts";

export type FootnoteDefinition = Parent & {
  type: "footnoteDefinition";
  children?: FlowContent[];
  identifier?: string;
  label?: string;
};

export const footnoteDefinitionSchema: ZodType<FootnoteDefinition> = parentSchema.extend({
  type: z.literal("footnoteDefinition").describe(
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
