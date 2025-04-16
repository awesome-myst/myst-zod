// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { flowContentSchema } from "./flow-content.ts";
import { admonitionTitleSchema } from "./admonition-title.ts";

export const admonitionSchema = parentSchema.extend({
  type: z.literal("admonition").describe("identifier for node variant"),
  kind: z.union([
    z.literal("attention"),
    z.literal("caution"),
    z.literal("danger"),
    z.literal("error"),
    z.literal("info"),
    z.literal("note"),
    z.literal("tip"),
    z.literal("warning"),
  ]).optional().describe("kind of admonition, to determine styling"),
  class: z.string().optional().describe(
    "admonition class info to override kind",
  ),
  children: z
    .array(z.union([admonitionTitleSchema, flowContentSchema]))
    .optional()
    .describe(
      "An optional `admonitionTitle` followed by the admonitions content.",
    ),
}).describe(
  "Admonition node for drawing attention to text, separate from the neighboring content",
);

export type Admonition = z.infer<typeof admonitionSchema>;
