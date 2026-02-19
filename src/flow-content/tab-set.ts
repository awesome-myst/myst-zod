// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Parent, parentSchema } from "../parent.ts";

export type TabSet = Parent & {
  type: "tabSet";
};

export const tabSetSchema: ZodType<TabSet> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("tabSet").describe("identifier for node variant"),
  })
  .describe("TabSet container for organizing content into tabs");

export type TabItem = Parent & {
  type: "tabItem";
  title: string;
  sync?: string;
  selected?: boolean;
};

export const tabItemSchema: ZodType<TabItem> = parentSchema
  // @ts-expect-error TS2740
  .extend({
    type: z.literal("tabItem").describe("identifier for node variant"),
    title: z.string().describe("title of the tab"),
    sync: z.string().optional().describe("sync identifier for synchronized tabs"),
    selected: z.boolean().optional().describe("whether this tab is selected by default"),
  })
  .describe("TabItem for individual tabs within a TabSet");
