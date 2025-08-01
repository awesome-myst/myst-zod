// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type PhrasingContent,
  phrasingContentSchema,
} from "../phrasing-content/phrasing-content.ts";

export type DefinitionList = Parent & {
  type: "definitionList";
  children?: (DefinitionTerm | DefinitionDescription)[];
};

export type DefinitionTerm = Parent & {
  type: "definitionTerm";
  children?: PhrasingContent[];
};

export type DefinitionDescription = Parent & {
  type: "definitionDescription";
  children?: (PhrasingContent | unknown)[];
};

export const definitionTermSchema: ZodType<DefinitionTerm> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("definitionTerm").describe("identifier for node variant"),
    children: z
      .array(phrasingContentSchema)
      .optional()
      .describe("phrasing content that defines the term"),
  })
  .describe("Definition term in a definition list");

export const definitionDescriptionSchema: ZodType<DefinitionDescription> =
  parentSchema
    // @ts-expect-error TS2740
    .extend({
      type: z
        .literal("definitionDescription")
        .describe("identifier for node variant"),
      children: z
        .array(z.union([phrasingContentSchema, z.unknown()]))
        .optional()
        .describe("phrasing content or flow content that describes the term"),
    })
    .describe("Definition description in a definition list");

export const definitionListSchema: ZodType<DefinitionList> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("definitionList").describe("identifier for node variant"),
    children: z
      .array(z.union([definitionTermSchema, definitionDescriptionSchema]))
      .optional()
      .describe("definition terms and descriptions"),
  })
  .describe("Definition list containing terms and their descriptions");
