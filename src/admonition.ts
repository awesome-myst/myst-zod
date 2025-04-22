// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
import {
  type AdmonitionTitle,
  admonitionTitleSchema,
} from "./admonition-title.ts";

export type Admonition = Parent & {
  type: "admonition";
  kind?:
    | "attention"
    | "caution"
    | "danger"
    | "error"
    | "info"
    | "important"
    | "note"
    | "tip"
    | "hint"
    | "seealso"
    | "warning";
  class?: string;
  children?: (AdmonitionTitle | FlowContent)[];
};

export const admonitionSchema: ZodType<Admonition> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("admonition").describe("identifier for node variant"),
    kind: z
      .enum([
        "attention",
        "caution",
        "danger",
        "error",
        "info",
        "important",
        "note",
        "tip",
        "hint",
        "seealso",
        "warning",
      ])
      .optional()
      .describe("kind of admonition, to determine styling"),
    class: z
      .string()
      .optional()
      .describe("admonition class info to override kind"),
    children: z.lazy(() =>
      z
        .array(z.union([admonitionTitleSchema, flowContentSchema]))
        .optional()
        .describe(
          "An optional `admonitionTitle` followed by the admonitions content."
        )
    ),
  })
  .describe(
    "Admonition node for drawing attention to text, separate from the neighboring content"
  );
