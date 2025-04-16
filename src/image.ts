// SPDX-License-Identifier: MIT

import { z } from "zod";

import { nodeSchema } from "./node.ts";

export const imageSchema = nodeSchema.extend({
  type: z.literal("image").describe("identifier for node variant"),
  class: z.string().optional().describe("user-defined class for the image"),
  width: z.string().optional().describe(
    "width of the image in pixels or percentage",
  ),
  align: z.enum(["left", "center", "right"]).optional().describe(
    "alignment of the image",
  ),
  url: z.string().describe("URL of the image"),
  title: z.string().optional().describe(
    "advisory information, e.g. for a tooltip",
  ),
  alt: z.string().optional().describe("field describing the image"),
}).describe("Image hyperlink");

export type Image = z.infer<typeof imageSchema>;
