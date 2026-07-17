# vite-plugin-nord-md

A Vite plugin that compiles Markdown files into [Nord](https://docs.nordjs.dev) components — with GFM, YAML frontmatter, and custom `:::directive` blocks that render registered components inline.

## Usage

```ts
import { defineConfig } from 'vite';
import { nordMarkdown } from 'vite-plugin-nord-md';

export default defineConfig({
    plugins: [
        nordMarkdown({
            components: [{ identifier: 'Note', importPath: '@grainular/aurora/runtime' }],
        }),
    ],
});
```

Any imported `.md` file is transformed into a Nord component. `components` maps directive identifiers (e.g. `::note`) to the module they're imported from; `remarkPlugins`/`rehypePlugins` extend the underlying [unified](https://unifiedjs.com) pipeline, and `transforms` lets you pre-process the raw Markdown source before parsing.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
