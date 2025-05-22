// SPDX-License-Identifier: MIT

import { type RefinementCtx, z, type ZodType } from "zod/v4";

import spdxCorrect from "spdx-correct";

import LICENSES from "./licenses-vendor/licenses.ts";

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

function createURL(id: string, cc?: boolean, osi?: boolean): string {
  if (cc) {
    const match =
      /^([CBYSAND0ZEROPDM-]+)(?:(?:-)([0-9].[0-9]))?(?:(?:-)([A-Z]{2,3}))?$/.exec(
        id
      );
    if (!match) {
      throw new Error("Creative Commons license not found");
    }
    const kind = match[1].toUpperCase();
    const version = match[2] ?? "4.0";
    const extra = match[3] ?? "";
    let link = "";
    switch (kind) {
      case "CC-BY":
        link = `/by/${version}/`;
        break;
      case "CC-BY-SA":
        link = `/by-sa/${version}/`;
        break;
      case "CC-BY-NC":
        link = `/by-nc/${version}/`;
        break;
      case "CC-BY-NC-SA":
        link = `/by-nc-sa/${version}/`;
        break;
      case "CC-BY-ND":
        link = `/by-nd/${version}/`;
        break;
      case "CC-BY-NC-ND":
        link = `/by-nc-nd/${version}/`;
        break;
      case "CC-ZERO":
      case "CC-0":
      case "CC0":
        link = "/zero/1.0/";
        break;
      case "CC-PDDC":
        link = "/publicdomain/";
        break;
      case "CC-PDM":
        link = "/publicdomain/mark/1.0/";
        break;
      default:
        break;
    }
    if (extra) link += `${extra}/`;
    return `https://creativecommons.org/licenses${link}`;
  }
  if (osi) {
    return `https://opensource.org/licenses/${id.replace(
      /(-or-later)|(-only)$/,
      ""
    )}`;
  }
  return `https://spdx.org/licenses/${id}`;
}

function cleanUrl(url: string) {
  return url.replace(/^http:/, "https:").replace(/\/$/, "");
}

function isUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol.includes("http");
  } catch (_error) {
    return false;
  }
}

function correctLicense(license?: string): string | undefined {
  if (!license) return undefined;
  const value = spdxCorrect(license);
  if (value) return value;
  if (license.toUpperCase() === "CC-BY") return "CC-BY-4.0";
  return undefined;
}

const ID_LICENSE_LOOKUP: Record<string, License> = Object.fromEntries(
  Object.entries(LICENSES).map(([key, value]) => {
    return [
      key,
      { id: key, ...value, url: createURL(key, value.CC, value.osi) },
    ];
  })
);

const URL_ID_LOOKUP: Record<string, string> = Object.fromEntries(
  Object.values(ID_LICENSE_LOOKUP)
    .filter(
      (value): value is License & { url: string; id: string } =>
        !!value.url && !!value.id
    )
    .map((value) => {
      return [cleanUrl(value.url), value.id];
    })
);

const licensePreprocessor = (
  data: string | Record<string, unknown>,
  ctx: RefinementCtx
) => {
  if (typeof data === "string") {
    const valueSpdx = data.length < 15 ? correctLicense(data) : undefined;
    if (URL_ID_LOOKUP[cleanUrl(data)]) {
      data = { id: URL_ID_LOOKUP[cleanUrl(data)] };
    } else if (isUrl(data)) {
      data = { url: data };
    } else if (valueSpdx) {
      data = { id: data };
    } else if (data.match(/^[^\s]*$/)) {
      data = { id: data };
    } else if (data.length < 100) {
      data = { name: data };
    } else {
      data = { note: data };
    }
  }

  if ("cc" in data) {
    if ("CC" in data) {
      ctx.issues.push({
        code: "custom",
        message: "License must define only one of `cc` or `CC`, not both",
        input: data,
      });
    }
    data.CC = data.cc;
    delete data.cc;
  }

  return data;
};

// @ts-ignore: // inconsistent TS2322
export const licenseSchema: ZodType<License> = z.preprocess(
  licensePreprocessor,
  z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      url: z.string().optional(),
      note: z.string().optional(),
      free: z.boolean().optional(),
      CC: z.boolean().optional(),
      osi: z.boolean().optional(),
    })
    .describe("License information")
);

export const licensesSchema: ZodType<Licenses> = z
  .object({
    content: licenseSchema.optional().describe("License for the content"),
    code: licenseSchema.optional().describe("License for the code"),
  })
  .describe("Licenses for the notebook");
