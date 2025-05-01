// SPDX-License-Identifier: MIT

import { RefinementCtx, z, type ZodType } from "zod";

export type OutputRemovalOptions =
  | "show"
  | "remove"
  | "remove-warn"
  | "remove-error"
  | "warn"
  | "error";

export type MystToTexSettings = {
  codeStyle?: "verbatim" | "minted" | "listings";
  beamer?: boolean;
};

export type ProjectSettings = {
  output_stderr?: OutputRemovalOptions;
  output_stdout?: OutputRemovalOptions;
  output_matplotlib_strings?: OutputRemovalOptions;
  myst_to_tex?: MystToTexSettings;
};

const PROJECT_SETTINGS_ALIAS = {
  stderr_output: "output_stderr",
  stdout_output: "output_stdout",
  mystToTex: "myst_to_tex",
  tex: "myst_to_tex", // The default is the renderer, not the parser
};

export const outputRemovalOptionsSchema: ZodType<OutputRemovalOptions> = z
  .enum(["show", "remove", "remove-warn", "remove-error", "warn", "error"])
  .describe("Output removal options");

const mystToTexSettingsPreprocessor = (
  data: Record<string, unknown>,
  ctx: RefinementCtx,
): Record<string, unknown> => {
  if (data.code_style) {
    if (data.codeStyle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "myst_to_tex must define only one of code_style and codeStyle, not both",
      });
    }
    data.codeStyle = data.code_style;
    delete data.code_style;
  }

  return data;
};

// @ts-expect-error TS2322
export const mystToTexSettingsSchema: ZodType<MystToTexSettings> = z.preprocess(
  // @ts-expect-error TS2345
  mystToTexSettingsPreprocessor,
  z
    .object({
      codeStyle: z
        .enum(["verbatim", "minted", "listings"])
        .optional()
        .describe("Code style for myst to tex conversion"),
      beamer: z
        .boolean()
        .optional()
        .describe("Beamer option for myst to tex conversion"),
    })
    .describe("Myst to tex settings"),
);

const projectSettingsPreprocessor = (
  data: Record<string, unknown>,
  ctx: RefinementCtx,
): Record<string, unknown> => {
  for (const [alias, key] of Object.entries(PROJECT_SETTINGS_ALIAS)) {
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

// @ts-expect-error TS2322
export const projectSettingsSchema: ZodType<ProjectSettings> = z.preprocess(
  // @ts-expect-error TS2345
  projectSettingsPreprocessor,
  z
    .object({
      output_stderr: outputRemovalOptionsSchema
        .optional()
        .describe("Output removal options for stderr"),
      output_stdout: outputRemovalOptionsSchema
        .optional()
        .describe("Output removal options for stdout"),
      output_matplotlib_strings: outputRemovalOptionsSchema
        .optional()
        .describe("Output removal options for matplotlib strings"),
      myst_to_tex: mystToTexSettingsSchema
        .optional()
        .describe("Myst to tex settings"),
    })
    .describe("Project settings"),
);
