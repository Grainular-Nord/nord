# @grainular/custom-elements

Turn [Nord](https://docs.nordjs.dev) components into native Web Components.

## Installation

```bash
npm install @grainular/custom-elements
# or
bun add @grainular/custom-elements
```

## Usage

```ts
import { createCustomElement } from '@grainular/custom-elements';
import { html } from '@grainular/nord';

createCustomElement((ctx) => html`<p>Hello, ${() => ctx.state().name ?? 'stranger'}!</p>`, {
    selector: 'hello-greeting',
    attributes: ['name'],
});
```

```html
<hello-greeting name="Nørd"></hello-greeting>
```

The component function receives the element instance as context, giving access to:

- `ctx.state` — a reactive grain reflecting the element's observed attributes
- `ctx.emit(event, payload)` — dispatch a `CustomEvent` from the element

## Options

`createCustomElement(component, definition)` accepts:

- `selector` — the custom element tag name (must contain a hyphen)
- `attributes` — attribute names to observe and expose via `ctx.state`
- `scoped` — render into a shadow root (default `true`)
- `styles` — an array of CSS strings adopted into the element's style root
- `onMount` / `onUnmount` — lifecycle callbacks

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
