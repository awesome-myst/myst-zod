// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import { type FlowContent, flowContentSchema } from "./flow-content.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type FootnoteDefinition = Parent & {
  type: "footnoteDefinition";
  children?: (FlowContent | PhrasingContent)[];
  identifier?: string;
  label?: string;
};

export const footnoteDefinitionSchema: ZodType<FootnoteDefinition> =
  parentSchema
    // @ts-expect-error TS2740
    .extend({
      type: z
        .literal("footnoteDefinition")
        .describe("identifier for node variant"),
      children: z.lazy(() =>
        z
          .array(z.union([flowContentSchema, phrasingContentSchema]))
          .optional()
          .describe("children of the footnote definition node")
      ),
      identifier: z
        .string()
        .optional()
        .describe(
          "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
        ),
      label: z
        .string()
        .optional()
        .describe(
          "node label; character escapes and references are parsed; may be normalized to a unique identifier",
        ),
    })
    .describe("Rich footnote content associated with footnote reference");
