// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "../node.ts";

export type Definition = Node & {
  type: "definition";
  identifier?: string;
  label?: string;
  url: string;
  title?: string;
};

export const definitionSchema: ZodType<Definition> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("definition").describe("identifier for node variant"),
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
    url: z
      .string()
      .describe(
        "A Uniform Resource Locator (URL) to an external resource or link.",
      ),
    title: z
      .string()
      .optional()
      .describe("advisory information, e.g. for a tooltip"),
  })
  .describe("Reference to a url resource");
