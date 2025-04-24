// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

export type License = {
  id?: string;
  name?: string;
  url?: string;
  note?: string;
  // These are only allowed if license is from SPDX
  free?: boolean;
  CC?: boolean;
  osi?: boolean;
};

export type Licenses = {
  content?: License;
  code?: License;
};

export const licenseSchema: ZodType<License> = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    url: z.string().optional(),
    note: z.string().optional(),
    free: z.boolean().optional(),
    CC: z.boolean().optional(),
    osi: z.boolean().optional(),
  })
  .describe("License information");

export const licensesSchema: ZodType<Licenses> = z
  .object({
    content: licenseSchema.optional().describe("License for the content"),
    code: licenseSchema.optional().describe("License for the code"),
  })
  .describe("Licenses for the notebook");
