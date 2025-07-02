// SPDX-License-Identifier: MIT

import { type RefinementCtx, z } from "zod";

export const SOCIAL_LINKS_KEYS = [
  "url",
  "github",
  "bluesky",
  "mastodon",
  "linkedin",
  "threads",
  "twitter", // Change to 'x' in future
  "youtube",
  "discourse",
  "discord",
  "slack",
  "facebook",
  "telegram",
] as const;

export const SOCIAL_LINKS_ALIASES = {
  website: "url",
  x: "twitter", // Can change this in a future release to be the other way
  bsky: "bluesky",
  instagram: "threads", // This is the same username
} as const;

export type SocialLinks = {
  [key in (typeof SOCIAL_LINKS_KEYS)[number]]?: string;
};

export const socialLinksTransform = (
  data: Record<string, unknown>,
  ctx: RefinementCtx,
): Record<string, unknown> => {
  for (const [alias, key] of Object.entries(SOCIAL_LINKS_ALIASES)) {
    if (alias in data) {
      if (data[key] !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate key "${key}"`,
        });
      }
      data[key] = data[alias];
      delete data[alias];
    }
  }

  return data;
};
