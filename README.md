# myst-zod

[![CI](https://github.com/awesome-myst/myst-zod/actions/workflows/test.yml/badge.svg)](https://github.com/awesome-myst/myst-zod/actions/workflows/test.yml)
[![NPM Version](https://img.shields.io/npm/v/%40awesome-myst/myst-zod?style=flat)](https://www.npmjs.com/package/@awesome-myst/myst-zod)
[![JSR](https://jsr.io/badges/@awesome-myst/myst-zod)](https://jsr.io/@awesome-myst/myst-zod)

> [Zod] schema for [MyST Markdown]

Parse [MyST Markdown] abstract syntax trees (ASTs) with a [Zod] schema. This
package provides a set of Zod schemas that can be used to validate and parse
MyST Markdown ASTs.

## Installation

```shell
npm install @awesome-myst/myst-zod
```

or

```shell
deno add jsr:@awesome-myst/myst-zod
```

## Usage

A Zod schema is a TypeScript type-safe way to validate and parse data. The
`rootSchema` is a Zod schema that can be used to validate and parse MyST
Markdown ASTs.

```typescript
import { rootSchema } from "@awesome-myst/myst-zod";

const myst = {
  type: "root",
  children: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "Hello, world!",
        },
      ],
    },
  ],
};

const result = rootSchema.parse(myst);
console.log(result);
// {
//   type: 'root',
//   children: [ { type: 'paragraph', children: [Array] } ]
// }
```

An
[example validator application](https://awesome-myst.github.io/myst-zod/examples/validator/)
is available
[in the `examples` directory](https://github.com/awesome-myst/myst-zod/blob/aaf48d575310e07d1c8795d935af3836f4d578be/examples/validator/index.html#L56-L62).
The example allows for selection from three commonly-used MyST schemas:

1. `rootSchema` - the root schema for
   [MyST Markdown AST](https://mystmd.org/spec).
2. `pageFrontmatterSchema` - the
   [frontmatter](https://mystmd.org/guide/frontmatter) schema for a MyST
   Markdown article or documentation page.
3. `pageSchema` - the schema for a MyST Markdown article or documentation page.
4. `projectFrontmatterSchema` - the frontmatter schema for a MyST book or
   project documentation.
5. `xrefSchema` - the
   [cross-reference schema](https://mystmd.org/guide/website-metadata#myst-xref-json)
   for a MyST Markdown project.

See also [awesome-myst] for more information about the MyST Markdown format.

## API

See the [API docs](https://jsr.io/@awesome-myst/myst-zod/doc).

## License

MIT License. See [LICENSE](./LICENSE.txt) for details.

## Contributing

Contributions are welcome!

First,
[install deno](https://docs.deno.com/runtime/getting_started/installation/),
then

```shell
deno install
deno test -ER
```

[awesome-myst]: https://github.com/awesome-myst/awesome-myst
[Zod]: https://zod.dev/
[MyST Markdown]: https://mystmd.org/
