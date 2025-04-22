// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static/static-phrasing-content.ts";

export type CrossReference = Parent & {
  type: "crossReference";
  kind?: "eq" | "numref" | "ref";
  children?: StaticPhrasingContent[];
  identifier?: string;
  label?: string;
};

export const crossReferenceSchema: ZodType<CrossReference> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("crossReference").describe("identifier for node variant"),
    kind: z
      .enum(["eq", "numref", "ref"])
      .optional()
      .describe("Indicates if the references should be numbered."),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe(
        'Children of the crossReference, can include text with "%s" or "{number}" and enumerated references will be filled in.',
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
  .describe("In-line reference to an associated node");
