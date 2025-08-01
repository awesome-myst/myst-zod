// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Node, nodeSchema } from "../node.ts";

export type Myst = Node & {
  type: "myst";
  value: string;
};

export const mystSchema: ZodType<Myst> = nodeSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("myst").describe("identifier for node variant"),
    value: z.string().describe("The MyST content to be parsed and rendered"),
  })
  .describe(
    "MyST node containing raw MyST markup that should be parsed and rendered"
  );
