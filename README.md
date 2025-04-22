# myst-zod

[![CI](https://github.com/awesome-myst/myst-zod/actions/workflows/test.yml/badge.svg)](https://github.com/awesome-myst/myst-zod/actions/workflows/test.yml)
[![NPM Version](https://img.shields.io/npm/v/%40awesome-myst/myst-zod?style=flat)](https://www.npmjs.com/package/@awesome-myst/myst-zod)
[![JSR](https://jsr.io/badges/@awesome-myst/myst-zod)](https://jsr.io/@awesome-myst/myst-zod)

> [Zod] schema for [MyST Markdown]

Parse [MyST Markdown] abstract syntax trees with a [Zod] schema. This package provides a set of Zod schemas that can be used to validate and parse MyST Markdown documents.

## Installation

```shell
npm install @awesome-myst/myst-zod
```
or

```shell
deno add @awesome-myst/myst-zod
```

## Usage

```typescript
import { rootSchema } from '@awesome-myst/myst-zod';

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
}

const result = rootSchema.parse(myst);
console.log(result);
// {
//   type: 'root',
//   children: [
//     { type: 'paragraph',
//       children: [ [Object] ] }
//   ]
// }
```

See also [awesome-myst] for more information about the MyST Markdown format.

## API

See the [API docs](https://jsr.io/@awesome-myst/myst-zod/doc).

## License

MIT License. See [LICENSE](./LICENSE.txt) for details.

## Contributing

Contributions are welcome!

To run the tests, use the following command:

```shell
deno test -R
```

[awesome-myst]: https://github.com/awesome-myst/awesome-myst
[Zod]: https://zod.dev/
[MyST Markdown]: https://mystmd.org/