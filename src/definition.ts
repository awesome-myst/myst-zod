// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const definitionSchema = nodeSchema.extend({
  type: z.literal("definition").describe("identifier for node variant"),
  identifier: z.string().optional().describe(
    "identifier that may match another node; value is unparsed and must be normalized such that whitespace is collapsed to single space, initial/final space is trimmed, and case is folded",
  ),
  label: z.string().optional().describe(
    "node label; character escapes and references are parsed; may be normalized to a unique identifier",
  ),
  url: z.string().describe(
    "A Uniform Resource Locator (URL) to an external resource or link.",
  ),
  title: z.string().optional().describe(
    "advisory information, e.g. for a tooltip",
  ),
}).describe("Reference to a url resource");

export type Definition = z.infer<typeof definitionSchema>;
