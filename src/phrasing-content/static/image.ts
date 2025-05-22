// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

import { type Node, nodeSchema } from "../../node.ts";

export type Image = Node & {
  type: "image";
  class?: string;
  width?: string;
  align?: "left" | "center" | "right";
  url: string;
  title?: string;
  alt?: string;
};

export const imageSchema: ZodType<Image> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("image").describe("identifier for node variant"),
    class: z.string().optional().describe("user-defined class for the image"),
    width: z
      .string()
      .optional()
      .describe("width of the image in pixels or percentage"),
    align: z
      .enum(["left", "center", "right"])
      .optional()
      .describe("alignment of the image"),
    url: z.string().describe("URL of the image"),
    title: z
      .string()
      .optional()
      .describe("advisory information, e.g. for a tooltip"),
    alt: z.string().optional().describe("field describing the image"),
  })
  .describe("Image hyperlink");
