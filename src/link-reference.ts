// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "./parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static-phrasing-content.ts";

export type LinkReference = Parent & {
  type: "linkReference";
  children?: StaticPhrasingContent[];
  referenceType: "shortcut" | "collapsed" | "full";
  identifier?: string;
  label?: string;
};

export const linkReferenceSchema: ZodType<LinkReference> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("linkReference").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("static children of the link reference node"),
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
  })
  .describe("Hyperlink through association");
