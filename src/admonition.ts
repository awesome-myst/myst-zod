// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

// Assuming Parent, FlowContent, AdmonitionTitle types are exported from these modules
import { type Parent, parentSchema } from "./parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
import {
  type AdmonitionTitle,
  admonitionTitleSchema,
} from "./admonition-title.ts";

export interface Admonition extends Parent {
  type: "admonition";
  kind?:
    | "attention"
    | "caution"
    | "danger"
    | "error"
    | "info"
    | "note"
    | "tip"
    | "warning";
  class?: string;
  children?: (AdmonitionTitle | FlowContent)[];
}

// Add the explicit type annotation ZodType<Admonition>
export const admonitionSchema: ZodType<Admonition> = parentSchema.extend({
  type: z.literal("admonition").describe("identifier for node variant"),
  kind: z.enum([
    "attention",
    "caution",
    "danger",
    "error",
    "info",
    "note",
    "tip",
    "warning",
  ]).optional().describe("kind of admonition, to determine styling"),
  class: z.string().optional().describe(
    "admonition class info to override kind",
  ),
  children: z
    .array(z.union([admonitionTitleSchema, flowContentSchema]))
    .optional()
    .describe(
      "An optional `admonitionTitle` followed by the admonitions content.",
    ),
}).describe(
  "Admonition node for drawing attention to text, separate from the neighboring content",
);

// The Admonition type is now defined via the interface above
