// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod/v4";

export type Venue = {
  title?: string;
  short_title?: string;
  url?: string;
  doi?: string;
  number?: string | number;
  location?: string;
  date?: string;
  series?: string;
  issn?: string;
  publisher?: string;
};

const venueTransform = (data: string | Record<string, unknown>) => {
  if (typeof data === "string") {
    return { title: data };
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const venueSchema: ZodType<Venue> = z
  .union([
    z.string(),
    z.object({
      title: z.string().optional().describe("Title of the venue"),
      short_title: z.string().optional().describe("Short title of the venue"),
      url: z.string().optional().describe("URL of the venue"),
      doi: z.string().optional().describe("DOI of the venue"),
      number: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Number of the venue"),
      location: z.string().optional().describe("Location of the venue"),
      date: z.string().optional().describe("Date of the venue"),
      series: z.string().optional().describe("Series of the venue"),
      issn: z.string().optional().describe("ISSN of the venue"),
      publisher: z.string().optional().describe("Publisher of the venue"),
    }),
  ])
  .transform(venueTransform)
  .describe("Venue information");
