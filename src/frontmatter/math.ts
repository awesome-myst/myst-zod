// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

export type MathMacro = {
  title?: string;
  description?: string;
  macro: string;
};

const mathMacroTransform = (
  data: string | Record<string, string>,
): Record<string, string> => {
  if (typeof data === "string") {
    return { macro: data };
  }
  return data;
};

// @ts-ignore: // inconsistent TS2322
export const mathMacroSchema: ZodType<MathMacro> = z
  .union([
    z.string(),
    z.object({
      title: z.string().optional().describe("Title of the macro"),
      description: z.string().optional().describe("Description of the macro"),
      macro: z.string().describe("The macro itself"),
    }),
  ])
  .transform(mathMacroTransform)
  .describe("Math macro for the notebook");
