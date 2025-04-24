// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type MathMacro = {
  title?: string;
  description?: string;
  macro: string;
};

export const mathMacroSchema: ZodType<MathMacro> = z
  .object({
    title: z.string().optional().describe("Title of the macro"),
    description: z.string().optional().describe("Description of the macro"),
    macro: z.string().describe("The macro itself"),
  })
  .describe("Math macro for the notebook");
