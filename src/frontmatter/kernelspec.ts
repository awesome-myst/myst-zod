// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type KernelSpec = {
  name: string;
  display_name: string;
  language?: string;
  argv?: string[];
  env?: Record<string, unknown>;
};

export const kernelSpecSchema: ZodType<KernelSpec> = z
  .object({
    name: z.string().describe("Name of the kernel"),
    display_name: z.string().describe("Display name of the kernel"),
    language: z
      .string()
      .optional()
      .describe("Language of the kernel"),
    argv: z
      .array(z.string())
      .optional()
      .describe("Arguments for the kernel"),
    env: z
      .object()
      .optional()
      .describe("Environment variables for the kernel"),
  })
  .describe("Kernel specification for the notebook");
