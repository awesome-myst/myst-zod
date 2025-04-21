// SPDX-License-Identifier: MIT

import { z } from "zod";

import { type Node, nodeSchema } from "./node.ts";
export type ImageReference = Node & {
  type: "imageReference";
  referenceType: "shortcut" | "collapsed" | "full";
  identifier?: string;
  label?: string;
  alt?: string;
};

export const imageReferenceSchema = nodeSchema
  .extend({
    type: z.literal("imageReference").describe("identifier for node variant"),
    referenceType: z
      .enum(["shortcut", "collapsed", "full"])
      .describe(
        "explicitness of the reference: `shortcut` - reference is implicit, identifier inferred, `collapsed` - reference explicit, identifier inferred, `full` - reference explicit, identifier explicit",
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
    alt: z.string().optional().describe("field describing the image"),
  })
  .describe("Image through association");
