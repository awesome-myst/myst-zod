// SPDX-License-Identifier: MIT

import { z, type ZodType } from "zod";

import { type Paragraph, paragraphSchema } from "./paragraph.ts";
import { type Definition, definitionSchema } from "./definition.ts";
import { type Heading, headingSchema } from "./heading.ts";
import { type ThematicBreak, thematicBreakSchema } from "./thematic-break.ts";
import { type List, listSchema } from "./list.ts";
import { type HTML, htmlSchema } from "./html.ts";
import { type Code, codeSchema } from "./code.ts";
import { type Comment, commentSchema } from "./comment.ts";
import { type Target, targetSchema } from "./target.ts";
import { type Directive, directiveSchema } from "./directive.ts";
import { type Admonition, admonitionSchema } from "./admonition.ts";
import { type Container, containerSchema } from "./container.ts";
import { type Math, mathSchema } from "./math.ts";
import { type Table, tableSchema } from "./table.ts";
import {
  type FootnoteDefinition,
  footnoteDefinitionSchema,
} from "./footnote-definition.ts";

export type FlowContent =
  | Paragraph
  | Definition
  | Heading
  | ThematicBreak
  | List
  | HTML
  | Code
  | Comment
  | Target
  | Directive
  | Admonition
  | Container
  | Math
  | Table
  | FootnoteDefinition;

// @ts-expect-error TS2740
export const flowContentSchema: ZodType<FlowContent> = z
  .discriminatedUnion("type", [
    // @ts-expect-error TS2740
    paragraphSchema,
    definitionSchema,
    headingSchema,
    thematicBreakSchema,
    listSchema,
    htmlSchema,
    codeSchema,
    commentSchema,
    targetSchema,
    directiveSchema,
    admonitionSchema,
    containerSchema,
    mathSchema,
    tableSchema,
    footnoteDefinitionSchema,
  ])
  .describe(
    "Flow content is a block of text that can contain other blocks of text. It is the most common type of content in Markdown. It includes paragraphs, definitions, headings, and thematic breaks.",
  );
