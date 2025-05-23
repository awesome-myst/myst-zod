// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "../node.ts";

export type FootnoteReference = Node & {
  type: "footnoteReference";
  identifier?: string;
  label?: string;
};

export const footnoteReferenceSchema: ZodType<FootnoteReference> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z
      .literal("footnoteReference")
      .describe("identifier for node variant"),
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
  .describe("Inline reference to footnote");
