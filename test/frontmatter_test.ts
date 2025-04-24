import {
  pageFrontmatterSchema,
  projectFrontmatterSchema,
} from "../src/index.ts";

import { assertEquals } from "jsr:@std/assert@1";

import yaml from "js-yaml";

import { glob } from "glob";

type TestCase = {
  title: string;
  skip: boolean;
  raw: string;
  normalized?: string;
  warnings?: number;
  errors?: number;
  opts?: Record<string, boolean>;
};

type TestFile = {
  title: string;
  frontmatter?: "project" | "page";
  cases: TestCase[];
};

const files = glob.sync("test/frontmatter/test-cases/*.yml");

const only = ""; // Can set this to a test title

const casesList = files
  .map((file) => ({ name: file, data: Deno.readTextFileSync(file).toString() }))
  .map((file) => {
    const tests = yaml.load(file.data) as TestFile;
    tests.title = tests.title ?? file.name;
    return tests;
  });

casesList.forEach(({ title, frontmatter, cases }) => {
  const casesToUse = cases.filter(
    (c) => (!only && !c.skip) || (only && c.title === only)
  );
  const skippedCases = cases.filter(
    (c) => c.skip || (only && c.title !== only)
  );
  if (casesToUse.length === 0) return;
  if (skippedCases.length > 0) {
    console.log(`Skipping ${skippedCases.length} tests in ${title}`);
  }
  console.log(`Running ${casesToUse.length} tests in ${title}`);
  casesToUse.forEach(({ title, raw, normalized, errors }) => {
    const testTitle = `${title}`;
    Deno.test(testTitle, () => {
      if (only) {
        // This runs in "only" mode
        console.log(raw);
      }
      if (frontmatter === "project") {
        const result = projectFrontmatterSchema.safeParse(raw);
        if (errors) {
          assertEquals(result.success, false);
        } else {
          if (!result.success) {
            console.error(result.error.format());
          }
          assertEquals(result.success, true);
        }
        if (normalized && !errors) {
          const normalizedResult =
            projectFrontmatterSchema.safeParse(normalized);
          assertEquals(normalizedResult.success, true);
        }
      } else {
        const result = pageFrontmatterSchema.safeParse(raw);
        if (errors) {
          assertEquals(result.success, false);
        } else {
          if (!result.success) {
            console.error(result.error.format());
          }
          assertEquals(result.success, true);
        }
        if (normalized && !errors) {
          const normalizedResult = pageFrontmatterSchema.safeParse(normalized);
          assertEquals(normalizedResult.success, true);
        }
      }
    });
  });
});
