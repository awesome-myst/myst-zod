// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type KernelSpec = {
  name: string;
  display_name: string;
  language?: string;
  argv?: string[];
  env?: Record<string, unknown>;
};

// @ts-expect-error TS2322
export const kernelSpecSchema: ZodType<KernelSpec> = z
  .object({
    name: z.string().default("python3").describe("Name of the kernel"),
    display_name: z.string().default("Python 3 Kernel").describe("Display name of the kernel"),
    language: z
      .string()
      .optional()
      .describe("Language of the kernel"),
    argv: z
      .array(z.string())
      .optional()
      .describe("Arguments for the kernel"),
    env: z
      .record(z.string(), z.any())
      .optional()
      .describe("Environment variables for the kernel"),
  })
  .describe("Kernel specification for the notebook");
