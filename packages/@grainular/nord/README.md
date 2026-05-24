# @grainular/nord

A lightweight, dependency-free, TypeScript-first reactive UI framework. Nord is a pure runtime — it requires no build step and ships with zero third-party dependencies. Components are plain functions, templates are tagged literals, and updates are surgical: no virtual DOM, no diffing, no re-rendering.

## Installation

```bash
npm install @grainular/nord
# or
bun add @grainular/nord
```

## Usage

```ts
import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

// Create some reactive state
const count = grain(0);

// Define a component — any function returning an html template
const App = () => html`
    <button ${on('click', () => count.update(n => n + 1))}>
        Count: ${count}
    </button>
`;

// Mount the component into the DOM
mount(App, { to: document.querySelector('#app') });
```

## Directives & Structs

Nord exposes DOM functionality through two complementary primitives:

- **Directives** attach behaviour directly to elements — event listeners, attributes, refs, and lifecycle callbacks. Use them to bridge between Nord's declarative templates and the underlying DOM.
- **Structs** handle control flow within templates — conditionals, loops, async resolution, and error boundaries. Use them anywhere you'd reach for an `if`, `switch`, or `for` in imperative code.

Both can be extended with `createDirective` and `createStruct` for custom primitives.

> Full documentation at [docs.nordjs.dev](https://docs.nordjs.dev).

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. Tests were also largely generated via LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
