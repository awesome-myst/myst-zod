// SPDX-License-Identifier: MIT

import { z } from "zod";

import { parentSchema } from "./parent.ts";
import { staticPhrasingContentSchema } from "./static-phrasing-content.ts";

export const strongStaticSchema = parentSchema
  .extend({
    type: z.literal("strong").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .describe("static children of the strong node"),
  })
  .describe(
    "Important, serious, urgent, bold content, with static children; used when parent node requires static content.",
  );

export type StrongStatic = z.infer<typeof strongStaticSchema>;
