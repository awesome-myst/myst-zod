// SPDX-License-Identifier: MIT

import { z } from "zod";
import { nodeSchema } from "./node.ts";

export const parentSchema = z.object({
  children: z.array(nodeSchema).describe("List of child nodes"),
  type: z.string().describe("identifier for node variant"),
  data: z.record(z.any()).optional().describe(
    "information associated by the ecosystem with the node; never specified by mdast",
  ),
  position: z
    .object({
      start: z.object({
        line: z.number().describe("line in the source file, 1-indexed"),
        column: z.number().describe("column in the source file, 1-indexed"),
        offset: z.number().optional().describe(
          "offset character in the source file, 0-indexed",
        ),
      }).describe("place of first character of parsed source region"),
      end: z.object({
        line: z.number().describe("line in the source file, 1-indexed"),
        column: z.number().describe("column in the source file, 1-indexed"),
        offset: z.number().optional().describe(
          "offset character in the source file, 0-indexed",
        ),
      }).describe("place of first character after parsed source region"),
      indent: z
        .array(z.number())
        .optional().describe(
          "start column at each index in the source region, for elements that span multiple lines",
        ),
    })
    .optional().describe(
      "location of node in source file; must not be present for generated nodes",
    ),
}).describe("Basic node with required node children");

export type Parent = z.infer<typeof parentSchema>;