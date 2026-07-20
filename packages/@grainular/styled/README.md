# @grainular/styled

Scoped component styles for [Nord](https://docs.nordjs.dev).

## Installation

```bash
npm install @grainular/styled
# or
bun add @grainular/styled
```

## Usage

```ts
import { css, withStyles } from '@grainular/styled';
import { html } from '@grainular/nord';

const Card = withStyles(
    () => html`<div class="card">Hello</div>`,
    () => css`
        .card {
            padding: 1rem;
            border-radius: 0.5rem;
        }
    `,
);
```

`css` tags a template literal into a style fragment with a unique scope identifier. `withStyles(template, styles)` wraps a component so its styles are adopted as a scoped stylesheet — each rule is rewritten to only match elements rendered by that component, so styles never leak across components.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
