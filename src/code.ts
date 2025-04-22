// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { nodeSchema } from "./node.ts";

export type Code = {
  type: "code";
  lang?: string;
  meta?: string;
  class?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  emphasizeLines?: number[];
  identifier?: string;
  label?: string;
};

export const codeSchema: ZodType<Code> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("code").describe("identifier for node variant"),
    lang: z.string().optional().describe("The language of the code block"),
    meta: z
      .string()
      .optional()
      .describe("The meta information of the code block"),
    class: z
      .string()
      .optional()
      .describe("The user-defined class of the code block"),
    showLineNumbers: z
      .boolean()
      .optional()
      .describe("Whether to show line numbers"),
    startingLineNumber: z
      .number()
      .optional()
      .describe("The starting line number"),
    emphasizeLines: z
      .array(z.number())
      .optional()
      .describe("The lines to emphasize"),
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
  .describe("Block of preformatted text");
