// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";
import {
  type StaticPhrasingContent,
  staticPhrasingContentSchema,
} from "./static/static-phrasing-content.ts";

export type Keyboard = Parent & {
  type: "keyboard";
  children?: StaticPhrasingContent[];
};

export const keyboardSchema: ZodType<Keyboard> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("keyboard").describe("identifier for node variant"),
    children: z
      .array(staticPhrasingContentSchema)
      .optional()
      .describe("static phrasing content that represents keyboard input"),
  })
  .describe("Keyboard input element");
